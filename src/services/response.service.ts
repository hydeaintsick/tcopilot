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

export class ResponseService {
  format(result: ActionResult, timezone: string): string {
    switch (result.type) {
      case "task_created":
        return this.formatTaskCreated(result.task!, timezone);

      case "tasks_created":
        return this.formatTasksCreated(result.tasks ?? [], timezone);

      case "task_updated":
        return this.formatTaskUpdated(result.task!);

      case "task_deleted":
        return `C'est fait ! J'ai supprimé « ${result.task!.title} ».`;

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
    if (!task.date) {
      return `C'est noté !\n\nJ'ai ajouté « ${task.title} » à ta liste.`;
    }

    const dateLabel = this.relativeDateLabel(task.date, timezone);

    if (task.time) {
      return `Parfait 👍\n\nJe te rappellerai ${dateLabel} à ${task.time} pour « ${task.title} ».`;
    }

    if (task.period) {
      const periodLabel = getPeriodLabel(task.period as TaskPeriod);
      return `Parfait 👍\n\nJe te rappellerai ${dateLabel} ${periodLabel} pour « ${task.title} ».`;
    }

    return `Parfait 👍\n\nJe te rappellerai ${dateLabel} à 9h pour « ${task.title} ».`;
  }

  private formatTasksCreated(tasks: TaskSummary[], timezone: string): string {
    if (tasks.length === 0) {
      return "Je n'ai pas pu créer les tâches.";
    }

    const lines = tasks.map((task) => {
      const schedule = this.formatTaskSchedule(task, timezone);
      return `• ${task.title}${schedule ? ` — ${schedule}` : ""}`;
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
        return `${emoji} ${task.title}${time ? ` — ${time}` : ""}`;
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
    const lines = tasks.map(
      (task, index) => `${index + 1}. ${task.title}`
    );
    return `J'ai trouvé plusieurs tâches. Laquelle ?\n\n${lines.join("\n")}`;
  }

  formatWelcome(): string {
    return `Salut ! Je suis TCopilot, ton assistant personnel.

Tu peux me parler naturellement :
• « Rappelle-moi d'appeler le médecin mardi à 15h »
• « Demain faut que je fasse la salle et les courses »
• « J'ai terminé ma séance »
• « Qu'est-ce que j'ai aujourd'hui ? »
• « Supprime la réunion »

Commandes : /help /today /tomorrow /week /month /tasks /done /delete`;
  }

  formatHelp(): string {
    return `Commandes disponibles :

/start — Message de bienvenue
/help — Cette aide
/today — Tâches du jour
/tomorrow — Tâches de demain
/week — Tâches des 7 prochains jours
/month — Tâches du mois
/tasks — Toutes les tâches
/done — Marquer une tâche terminée (réponds à un message)
/delete — Supprimer une tâche (réponds à un message)

Tu peux aussi me parler librement en français !
• Crée plusieurs tâches en une seule phrase
• « J'ai fait X » pour marquer une tâche comme terminée`;
  }
}
