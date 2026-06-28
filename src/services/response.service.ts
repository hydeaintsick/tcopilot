import type { TaskPeriod } from "@prisma/client";
import type { ActionResult, TaskSummary } from "../types/intent";
import {
  addDaysToDateString,
  formatDateForDisplay,
  getPeriodLabel,
  getTodayInTimezone,
} from "../utils/date.utils";

const EMOJI_RULES: Array<[RegExp, string]> = [
  [/sport|salle|gym|musculation|séance|entraînement|fitness|running|course à pied|jogging|vélo|natation|piscine|yoga|pilates/i, "🏋️"],
  [/courses?|supermarché|lidl|aldi|carrefour|leclerc|monoprix|intermarché|épicerie|marché/i, "🛒"],
  [/médecin|docteur|dentiste|kiné|ophtalmo|cardio|santé|hôpital|clinique|pharmacie|médicament|rdv médical/i, "🏥"],
  [/appel|appeler|téléphoner|contacter|rappeler|appel téléphonique/i, "📞"],
  [/réunion|meeting|conf|call|standup|présentation|brainstorm|entretien|interview|talent review/i, "💼"],
  [/avion|vol|billet|voyage|vacances|hôtel|airbnb|train|taxi|uber|aéroport/i, "✈️"],
  [/restaurant|dîner|déjeuner|manger|repas|brunch|café|apéro/i, "🍽️"],
  [/mail|email|courriel|message|envoyer|répondre/i, "📧"],
  [/banque|virement|paiement|facture|impôts|argent|loyer|assurance/i, "💰"],
  [/ménage|nettoyage|nettoyer|ranger|vaisselle|lessive|aspirateur/i, "🧹"],
  [/livre|lire|lecture|étude|révision|cours|formation/i, "📚"],
  [/clim|chauffage|plombier|électricien|réparation|bricolage/i, "🔧"],
  [/anniversaire|fête|soirée|mariage|invitation|cadeau/i, "🎉"],
  [/enfant|école|crèche|nounou|devoirs/i, "👨‍👩‍👧"],
  [/pharmacie|médicament|ordonnance/i, "💊"],
];

function getTaskEmoji(title: string): string {
  for (const [pattern, emoji] of EMOJI_RULES) {
    if (pattern.test(title)) return emoji;
  }
  return "📌";
}

function formatDateTimeFr(date: Date, timezone: string): string {
  return new Intl.DateTimeFormat("fr-FR", {
    timeZone: timezone,
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export class ResponseService {
  /** Préfixe lisible d'une tâche (« #3 »), vide si la tâche n'a pas d'identifiant. */
  private idLabel(task: TaskSummary): string {
    return task.displayId != null ? `#${task.displayId} ` : "";
  }

  format(result: ActionResult, timezone: string): string {
    switch (result.type) {
      case "task_created":
        return this.formatTaskCreated(result.task!, timezone);

      case "tasks_created":
        return this.formatTasksCreated(result.tasks ?? [], timezone);

      case "task_updated":
        return this.formatTaskUpdated(result.task!);

      case "task_deleted":
        return `C'est fait ! J'ai supprimé ${this.idLabel(result.task!)}« ${result.task!.title} ».`;

      case "tasks_deleted": {
        const titles = (result.tasks ?? []).map((t) => `« ${t.title} »`).join(" et ");
        return `C'est fait ! J'ai supprimé ${titles}.`;
      }

      case "task_done":
        return `Bravo 👍 « ${result.task!.title} » est marquée comme terminée.`;

      case "tasks_done": {
        const titles = (result.tasks ?? []).map((t) => `« ${t.title} »`).join(" et ");
        return `Bravo 👍 ${titles} sont marquées comme terminées.`;
      }

      case "task_list":
        return this.formatTaskList(result.tasks ?? [], timezone);

      case "timezone_updated":
        return `Parfait ! Ton fuseau horaire est maintenant ${result.message}.`;

      case "ambiguous_task":
        return this.formatAmbiguous(result.tasks ?? []);

      case "task_not_found":
        return "Je n'ai pas trouvé de tâche correspondante. Peux-tu préciser ?";

      case "unknown":
        return "Je n'ai pas compris ta demande.";

      case "error":
        return result.message ?? "Une erreur est survenue.";

      default:
        return "Je n'ai pas compris ta demande.";
    }
  }

  private formatTaskCreated(task: TaskSummary, timezone: string): string {
    const tag = task.displayId != null ? `\n\n🆔 #${task.displayId}` : "";

    if (!task.date) {
      return `C'est noté !\n\nJ'ai ajouté « ${task.title} » à ta liste.${tag}`;
    }

    const dateLabel = this.relativeDateLabel(task.date, timezone);

    if (task.time) {
      return `Parfait 👍\n\nJe te rappellerai ${dateLabel} à ${task.time} pour « ${task.title} ».${tag}`;
    }

    if (task.period) {
      const periodLabel = getPeriodLabel(task.period as TaskPeriod);
      return `Parfait 👍\n\nJe te rappellerai ${dateLabel} ${periodLabel} pour « ${task.title} ».${tag}`;
    }

    return `Parfait 👍\n\nJe te rappellerai ${dateLabel} à 9h pour « ${task.title} ».${tag}`;
  }

  private formatTasksCreated(tasks: TaskSummary[], timezone: string): string {
    if (tasks.length === 0) {
      return "Je n'ai pas pu créer les tâches.";
    }

    const lines = tasks.map((task) => {
      const schedule = this.formatTaskSchedule(task, timezone);
      return `• ${this.idLabel(task)}${task.title}${schedule ? ` — ${schedule}` : ""}`;
    });

    return `Parfait 👍 J'ai créé ${tasks.length} tâches :\n\n${lines.join("\n")}`;
  }

  private formatTaskUpdated(task: TaskSummary): string {
    if (task.date && task.time) {
      return `C'est modifié ! « ${task.title} » est prévu le ${formatDateForDisplay(task.date)} à ${task.time}.`;
    }
    if (task.date) {
      return `C'est modifié ! « ${task.title} » est prévu le ${formatDateForDisplay(task.date)}.`;
    }
    return `C'est modifié ! « ${task.title} » a été mise à jour.`;
  }

  formatTaskList(tasks: TaskSummary[], timezone: string): string {
    if (tasks.length === 0) {
      return "Tu n'as rien de prévu.";
    }

    // Group tasks by date (null → "no_date" bucket)
    const groups = new Map<string, TaskSummary[]>();
    for (const task of tasks) {
      const key = task.date ?? "no_date";
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key)!.push(task);
    }

    // Sort keys: dated ones chronologically, no_date last
    const sortedKeys = [...groups.keys()].sort((a, b) => {
      if (a === "no_date") return 1;
      if (b === "no_date") return -1;
      return a.localeCompare(b);
    });

    const sections: string[] = [];

    for (const key of sortedKeys) {
      const dayTasks = groups.get(key)!;
      const header = key === "no_date"
        ? "📋 <b>Sans date</b>"
        : `${this.dayEmoji(key, timezone)} <b>${this.dayLabel(key, timezone)}</b>`;

      const lines = dayTasks.map((task) => {
        const time = this.formatTaskTime(task);
        const emoji = getTaskEmoji(task.title);
        return `${emoji} ${this.idLabel(task)}${task.title}${time ? ` — ${time}` : ""}`;
      });

      sections.push(`${header}\n${lines.join("\n")}`);
    }

    return sections.join("\n\n");
  }

  private dayEmoji(dateStr: string, timezone: string): string {
    const today = getTodayInTimezone(timezone);
    const tomorrow = addDaysToDateString(today, 1);
    if (dateStr === today) return "📅";
    if (dateStr === tomorrow) return "📆";
    return "🗓";
  }

  private dayLabel(dateStr: string, timezone: string): string {
    const today = getTodayInTimezone(timezone);
    const tomorrow = addDaysToDateString(today, 1);
    if (dateStr === today) return "Aujourd'hui";
    if (dateStr === tomorrow) return "Demain";
    return formatDateForDisplay(dateStr);
  }

  /** Returns only the time/period part of a task (no date). */
  private formatTaskTime(task: TaskSummary): string {
    if (task.time) return task.time;
    if (task.period) return getPeriodLabel(task.period as TaskPeriod);
    return "";
  }

  private formatTaskSchedule(task: TaskSummary, timezone: string): string {
    if (!task.date) {
      return "sans date";
    }

    const dateLabel = this.relativeDateLabel(task.date, timezone);

    if (task.time) {
      return `${dateLabel} à ${task.time}`;
    }

    if (task.period) {
      return `${dateLabel} ${getPeriodLabel(task.period as TaskPeriod)}`;
    }

    return dateLabel;
  }

  relativeDateLabel(dateStr: string, timezone: string): string {
    const today = getTodayInTimezone(timezone);
    const tomorrow = addDaysToDateString(today, 1);

    if (dateStr === today) {
      return "aujourd'hui";
    }
    if (dateStr === tomorrow) {
      return "demain";
    }
    return `le ${formatDateForDisplay(dateStr)}`;
  }

  private formatAmbiguous(tasks: TaskSummary[]): string {
    const lines = tasks.map((task, index) => {
      const ref = task.displayId != null ? `#${task.displayId}` : `${index + 1}.`;
      return `${ref} ${task.title}`;
    });
    return `J'ai trouvé plusieurs tâches. Laquelle ? Réponds avec son numéro (ex : « ${
      tasks[0]?.displayId ?? 1
    } »).\n\n${lines.join("\n")}`;
  }

  formatWelcome(): string {
    return `Salut ! Je suis TCopilot, ton assistant personnel.

Tu peux me parler naturellement :
• « Rappelle-moi d'appeler le médecin mardi à 15h »
• « Demain faut que je fasse la salle et les courses »
• « J'ai terminé ma séance »
• « Qu'est-ce que j'ai aujourd'hui ? »
• « Supprime la tâche 3 »

Commandes : /help /today /tomorrow /week /month /tasks /done /delete /subscribe /status`;
  }

  formatHelp(priceInStars: number): string {
    return `📖 <b>Comment utiliser TCopilot</b>

Parle-moi naturellement, en texte ou en vocal 🎙 :
• « Rappelle-moi d'appeler le médecin mardi à 15h »
• « Demain : salle de sport et courses » (plusieurs tâches d'un coup)
• « J'ai fait les courses » → marque la tâche comme terminée
• « Déplace l'appel médecin à demain 16h »
• « Qu'est-ce que j'ai cette semaine ? »

🆔 <b>Gérer par numéro</b>
Chaque tâche a un numéro (#1, #2, #3…) affiché dans tes listes.
• <code>/delete 3</code> — supprime la tâche #3
• <code>/done 3</code> — marque la tâche #3 comme terminée
• Quand plusieurs tâches se ressemblent, je te demande laquelle : réponds simplement avec son numéro.

📋 <b>Commandes</b>
/today — Tâches du jour
/tomorrow — Tâches de demain
/week — Tâches des 7 prochains jours
/month — Tâches du mois
/tasks — Toutes les tâches
/done [n] — Marquer terminée (numéro, ou en réponse à un message)
/delete [n] — Supprimer (numéro, ou en réponse à un message)
/subscribe — S'abonner à TCopilot Premium (${priceInStars} ⭐/mois)
/status — État de ton abonnement

💡 Astuce : règle ton fuseau horaire en disant « je suis à Montréal ».`;
  }

  formatPaywall(priceInStars: number): string {
    return `🔒 <b>TCopilot Premium</b>

Pour utiliser ton assistant, il te faut un abonnement actif.

✨ <b>${priceInStars} ⭐ / mois</b> — renouvellement automatique, annulable à tout moment dans Telegram.

Appuie sur /subscribe pour t'abonner en quelques secondes. ⭐`;
  }

  formatSubscriptionInvoiceIntro(priceInStars: number): string {
    return `Voici ta facture pour TCopilot Premium (${priceInStars} ⭐/mois). Confirme le paiement ci-dessous pour activer ton accès. ✨`;
  }

  formatSubscriptionSuccess(
    expiresAt: Date | null,
    timezone: string,
    isFirst: boolean
  ): string {
    const until = expiresAt
      ? `\n\nProchain renouvellement : ${formatDateTimeFr(expiresAt, timezone)}.`
      : "";
    if (isFirst) {
      return `Merci et bienvenue dans TCopilot Premium ! 🎉\n\nTon accès est maintenant actif.${until}`;
    }
    return `Abonnement renouvelé, merci de ta confiance ! 💙${until}`;
  }

  formatStatus(
    status: {
      hasAccess: boolean;
      reason: "whitelist" | "subscription" | "trial" | "none";
      expiresAt: Date | null;
    },
    timezone: string,
    isAdmin: boolean,
    priceInStars: number
  ): string {
    if (isAdmin) {
      return "👑 Tu es administrateur : accès complet et illimité.";
    }
    switch (status.reason) {
      case "whitelist":
        return "✅ Accès Premium offert (à vie). Profite bien ! 💙";
      case "subscription":
        return `✅ Abonnement Premium actif.\n\nProchain renouvellement : ${
          status.expiresAt ? formatDateTimeFr(status.expiresAt, timezone) : "—"
        }.`;
      case "trial":
        return `🎁 Essai gratuit en cours jusqu'au ${
          status.expiresAt ? formatDateTimeFr(status.expiresAt, timezone) : "—"
        }.\n\nAbonne-toi avec /subscribe (${priceInStars} ⭐/mois) pour continuer ensuite.`;
      default:
        return `❌ Aucun abonnement actif.\n\nAbonne-toi avec /subscribe (${priceInStars} ⭐/mois).`;
    }
  }

  formatGranted(telegramUserId: bigint): string {
    return `✅ Accès Premium offert à l'utilisateur ${telegramUserId}.`;
  }

  formatRevoked(telegramUserId: bigint): string {
    return `🚫 Accès Premium retiré à l'utilisateur ${telegramUserId}.`;
  }

  formatAdminUsage(command: string): string {
    return `Usage : /${command} <telegram_user_id>`;
  }
}
