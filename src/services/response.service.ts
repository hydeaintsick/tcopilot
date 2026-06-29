import type { TaskPeriod } from "@prisma/client";
import type { ActionResult, TaskSummary } from "../types/intent";
import { getBotDict, type BotDict } from "../i18n/bot-messages";
import type { Language } from "../lib/i18n";
import {
  addDaysToDateString,
  formatDateForDisplay,
  getTodayInTimezone,
} from "../utils/date.utils";

const EMOJI_RULES: Array<[RegExp, string]> = [
  [/sport|salle|gym|musculation|séance|entraînement|fitness|running|course à pied|jogging|vélo|natation|piscine|yoga|pilates|workout|gimnasio|palestra|тренировк|posilovn/i, "🏋️"],
  [/courses?|supermarché|lidl|aldi|carrefour|leclerc|monoprix|intermarché|épicerie|marché|grocer|compra|spesa|покупк|nákup/i, "🛒"],
  [/médecin|docteur|dentiste|kiné|ophtalmo|cardio|santé|hôpital|clinique|pharmacie|médicament|rdv médical|doctor|médico|medico|врач|lékař/i, "🏥"],
  [/appel|appeler|téléphoner|contacter|rappeler|appel téléphonique|call|llamar|chiamare|звон|volat|hovor/i, "📞"],
  [/réunion|meeting|conf|call|standup|présentation|brainstorm|entretien|interview|talent review|reunión|riunione|встреч|schůzk/i, "💼"],
  [/avion|vol|billet|voyage|vacances|hôtel|airbnb|train|taxi|uber|aéroport|flight|travel|viaje|viaggio|поездк/i, "✈️"],
  [/restaurant|dîner|déjeuner|manger|repas|brunch|café|apéro|dinner|lunch|cena|pranzo|ужин/i, "🍽️"],
  [/mail|email|courriel|message|envoyer|répondre|correo|messaggio|письм|mejl/i, "📧"],
  [/banque|virement|paiement|facture|impôts|argent|loyer|assurance|invoice|payment|factura|fattura|оплат|платеж|faktur/i, "💰"],
  [/ménage|nettoyage|nettoyer|ranger|vaisselle|lessive|aspirateur|clean|limpieza|pulizia|уборк|úklid/i, "🧹"],
  [/livre|lire|lecture|étude|révision|cours|formation|read|study|leer|estudio|leggere|читать/i, "📚"],
  [/clim|chauffage|plombier|électricien|réparation|bricolage|repair|reparación|riparazione|ремонт/i, "🔧"],
  [/anniversaire|fête|soirée|mariage|invitation|cadeau|birthday|party|fiesta|festa|праздник/i, "🎉"],
  [/enfant|école|crèche|nounou|devoirs|school|child|escuela|scuola|школ|škol/i, "👨‍👩‍👧"],
  [/pharmacie|médicament|ordonnance|pharmacy|farmacia|аптек|lékárn/i, "💊"],
];

function getTaskEmoji(title: string): string {
  for (const [pattern, emoji] of EMOJI_RULES) {
    if (pattern.test(title)) return emoji;
  }
  return "📌";
}

function formatDateTime(date: Date, timezone: string, locale: string): string {
  return new Intl.DateTimeFormat(locale, {
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

  format(result: ActionResult, timezone: string, lang: Language): string {
    const d = getBotDict(lang);
    switch (result.type) {
      case "task_created":
        return this.formatTaskCreated(result.task!, timezone, d);

      case "tasks_created":
        return this.formatTasksCreated(result.tasks ?? [], timezone, d);

      case "task_updated":
        return this.formatTaskUpdated(result.task!, d);

      case "task_deleted":
        return d.taskDeleted(this.idLabel(result.task!), result.task!.title);

      case "tasks_deleted":
        return d.tasksDeleted(d.joinAnd((result.tasks ?? []).map((t) => `« ${t.title} »`)));

      case "task_done":
        return d.taskDone(result.task!.title);

      case "tasks_done":
        return d.tasksDone(d.joinAnd((result.tasks ?? []).map((t) => `« ${t.title} »`)));

      case "task_list":
        return this.formatTaskList(result.tasks ?? [], timezone, lang);

      case "timezone_updated":
        return d.timezoneUpdated(result.message ?? "");

      case "ambiguous_task":
        return this.formatAmbiguous(result.tasks ?? [], d);

      case "task_not_found":
        return d.taskNotFound;

      case "unknown":
        return d.unknown;

      case "error":
        return this.formatError(result, d);

      default:
        return d.unknown;
    }
  }

  private formatError(result: ActionResult, d: BotDict): string {
    switch (result.code) {
      case "no_title":
        return d.errNoTitle;
      case "invalid_timezone":
        return d.errInvalidTimezone(result.message ?? "");
      case "timezone_missing":
        return d.errTimezoneMissing;
      default:
        return result.message ?? d.genericError;
    }
  }

  private formatTaskCreated(task: TaskSummary, timezone: string, d: BotDict): string {
    const tag = task.displayId != null ? `\n\n🆔 #${task.displayId}` : "";

    if (!task.date) {
      return d.taskCreatedNoDate(task.title, tag);
    }

    const dateLabel = this.relativeDateLabel(task.date, timezone, d);

    if (task.time) {
      return d.taskCreatedTime(dateLabel, task.time, task.title, tag);
    }

    if (task.period) {
      const periodLabel = d.periods[task.period as TaskPeriod];
      return d.taskCreatedPeriod(dateLabel, periodLabel, task.title, tag);
    }

    return d.taskCreatedDefault(dateLabel, task.title, tag);
  }

  private formatTasksCreated(tasks: TaskSummary[], timezone: string, d: BotDict): string {
    if (tasks.length === 0) {
      return d.tasksCreatedEmpty;
    }

    const lines = tasks.map((task) => {
      const schedule = this.formatTaskSchedule(task, timezone, d);
      return `• ${this.idLabel(task)}${task.title}${schedule ? ` — ${schedule}` : ""}`;
    });

    return `${d.tasksCreatedHeader(tasks.length)}\n\n${lines.join("\n")}`;
  }

  private formatTaskUpdated(task: TaskSummary, d: BotDict): string {
    if (task.date && task.time) {
      return d.taskUpdatedDateTime(task.title, formatDateForDisplay(task.date, d.locale), task.time);
    }
    if (task.date) {
      return d.taskUpdatedDate(task.title, formatDateForDisplay(task.date, d.locale));
    }
    return d.taskUpdatedGeneric(task.title);
  }

  formatTaskList(tasks: TaskSummary[], timezone: string, lang: Language): string {
    const d = getBotDict(lang);
    if (tasks.length === 0) {
      return d.listEmpty;
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
        ? d.headerNoDate
        : `${this.dayEmoji(key, timezone)} <b>${this.dayLabel(key, timezone, d)}</b>`;

      const lines = dayTasks.map((task) => {
        const time = this.formatTaskTime(task, d);
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

  private dayLabel(dateStr: string, timezone: string, d: BotDict): string {
    const today = getTodayInTimezone(timezone);
    const tomorrow = addDaysToDateString(today, 1);
    if (dateStr === today) return d.todayCap;
    if (dateStr === tomorrow) return d.tomorrowCap;
    return formatDateForDisplay(dateStr, d.locale);
  }

  /** Returns only the time/period part of a task (no date). */
  private formatTaskTime(task: TaskSummary, d: BotDict): string {
    if (task.time) return task.time;
    if (task.period) return d.periods[task.period as TaskPeriod];
    return "";
  }

  private formatTaskSchedule(task: TaskSummary, timezone: string, d: BotDict): string {
    if (!task.date) {
      return d.scheduleNoDate;
    }

    const dateLabel = this.relativeDateLabel(task.date, timezone, d);

    if (task.time) {
      return `${dateLabel} ${d.atTime(task.time)}`;
    }

    if (task.period) {
      return `${dateLabel} ${d.periods[task.period as TaskPeriod]}`;
    }

    return dateLabel;
  }

  relativeDateLabel(dateStr: string, timezone: string, d: BotDict): string {
    const today = getTodayInTimezone(timezone);
    const tomorrow = addDaysToDateString(today, 1);

    if (dateStr === today) {
      return d.today;
    }
    if (dateStr === tomorrow) {
      return d.tomorrow;
    }
    return d.onDate(formatDateForDisplay(dateStr, d.locale));
  }

  private formatAmbiguous(tasks: TaskSummary[], d: BotDict): string {
    const lines = tasks.map((task, index) => {
      const ref = task.displayId != null ? `#${task.displayId}` : `${index + 1}.`;
      return `${ref} ${task.title}`;
    });
    return d.ambiguous(tasks[0]?.displayId ?? 1, lines.join("\n"));
  }

  formatWelcome(lang: Language): string {
    return getBotDict(lang).welcome;
  }

  formatHelp(priceInStars: number, lang: Language): string {
    return getBotDict(lang).help(priceInStars);
  }

  formatPaywall(priceInStars: number, lang: Language): string {
    return getBotDict(lang).paywall(priceInStars);
  }

  formatSubscriptionInvoiceIntro(priceInStars: number, lang: Language): string {
    return getBotDict(lang).subscriptionIntro(priceInStars);
  }

  formatSubscriptionSuccess(
    expiresAt: Date | null,
    timezone: string,
    isFirst: boolean,
    lang: Language
  ): string {
    const d = getBotDict(lang);
    const until = expiresAt ? d.nextRenewal(formatDateTime(expiresAt, timezone, d.locale)) : "";
    return isFirst ? d.subscriptionSuccessFirst(until) : d.subscriptionRenewed(until);
  }

  formatStatus(
    status: {
      hasAccess: boolean;
      reason: "whitelist" | "subscription" | "trial" | "none";
      expiresAt: Date | null;
    },
    timezone: string,
    isAdmin: boolean,
    priceInStars: number,
    lang: Language
  ): string {
    const d = getBotDict(lang);
    if (isAdmin) {
      return d.statusAdmin;
    }
    const dateLabel = status.expiresAt ? formatDateTime(status.expiresAt, timezone, d.locale) : "—";
    switch (status.reason) {
      case "whitelist":
        return d.statusWhitelist;
      case "subscription":
        return d.statusSubscription(dateLabel);
      case "trial":
        return d.statusTrial(dateLabel, priceInStars);
      default:
        return d.statusNone(priceInStars);
    }
  }

  formatGranted(telegramUserId: bigint, lang: Language): string {
    return getBotDict(lang).granted(telegramUserId.toString());
  }

  formatRevoked(telegramUserId: bigint, lang: Language): string {
    return getBotDict(lang).revoked(telegramUserId.toString());
  }

  formatAdminUsage(command: string, lang: Language): string {
    return getBotDict(lang).adminUsage(command);
  }
}
