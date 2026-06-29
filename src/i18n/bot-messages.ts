import type { TaskPeriod } from "@prisma/client";
import { DEFAULT_LANGUAGE, resolveLanguage, type Language } from "../lib/i18n";

/**
 * Dictionnaire des messages du bot Telegram (réponses conversationnelles +
 * libellés des boutons). Distinct du dictionnaire de la landing page
 * (`src/lib/i18n.ts`) qui ne concerne que le site vitrine.
 *
 * Règle produit : seuls les slugs de commandes (/today, /done, ...) restent en
 * anglais. Tout le reste (texte, boutons, descriptions de commandes) suit la
 * langue choisie par l'utilisateur.
 */
export interface BotDict {
  /** Locale BCP-47 utilisée pour Intl (dates, heures). */
  locale: string;
  /** Nom natif avec drapeau, affiché dans le sélecteur de langue. */
  pickerName: string;

  periods: Record<TaskPeriod, string>;

  // Libellés de dates relatives (au fil d'une phrase, en minuscule).
  today: string;
  tomorrow: string;
  onDate: (date: string) => string;
  // Versions « titre » (en-tête de section).
  todayCap: string;
  tomorrowCap: string;
  atTime: (time: string) => string;
  defaultHourPhrase: string;

  joinAnd: (titles: string[]) => string;

  // Résultats d'action.
  taskDeleted: (label: string, title: string) => string;
  tasksDeleted: (titles: string) => string;
  taskDone: (title: string) => string;
  tasksDone: (titles: string) => string;
  timezoneUpdated: (tz: string) => string;
  taskNotFound: string;
  unknown: string;
  genericError: string;

  // Création.
  taskCreatedNoDate: (title: string, tag: string) => string;
  taskCreatedTime: (dateLabel: string, time: string, title: string, tag: string) => string;
  taskCreatedPeriod: (dateLabel: string, periodLabel: string, title: string, tag: string) => string;
  taskCreatedDefault: (dateLabel: string, title: string, tag: string) => string;
  tasksCreatedEmpty: string;
  tasksCreatedHeader: (count: number) => string;
  scheduleNoDate: string;

  // Mise à jour.
  taskUpdatedDateTime: (title: string, date: string, time: string) => string;
  taskUpdatedDate: (title: string, date: string) => string;
  taskUpdatedGeneric: (title: string) => string;

  // Listes.
  listEmpty: string;
  headerNoDate: string;
  ambiguous: (example: string | number, lines: string) => string;

  // Boutons de navigation.
  navToday: string;
  navTomorrow: string;
  navWeek: string;
  navMonth: string;
  navAll: string;

  // En-têtes de sections envoyées.
  sectionTomorrow: string;
  sectionWeek: string;
  sectionMonth: string;
  sectionAll: string;

  // Onboarding / aide / paywall.
  welcome: string;
  help: (price: number) => string;
  paywall: (price: number) => string;
  subscribeButton: (price: number) => string;
  subscriptionIntro: (price: number) => string;
  nextRenewal: (date: string) => string;
  subscriptionSuccessFirst: (until: string) => string;
  subscriptionRenewed: (until: string) => string;

  // Statut.
  statusAdmin: string;
  statusWhitelist: string;
  statusSubscription: (date: string) => string;
  statusTrial: (date: string, price: number) => string;
  statusNone: (price: number) => string;

  // Admin.
  granted: (id: string) => string;
  revoked: (id: string) => string;
  adminUsage: (cmd: string) => string;

  // Codes d'erreur métier.
  errNoTitle: string;
  errInvalidTimezone: (tz: string) => string;
  errTimezoneMissing: string;

  // Vocal.
  voiceError: string;
  voiceEmpty: string;
  voiceHeard: (text: string) => string;

  // Aides d'usage.
  doneUsage: string;
  deleteUsage: string;

  // Rappels.
  reminderDue: (title: string, timeLabel: string) => string;
  reminderAtTime: (time: string) => string;

  // Sélecteur de langue.
  languagePrompt: string;
  languageSet: string;

  // Descriptions des commandes (le slug reste anglais).
  commands: {
    today: string;
    tomorrow: string;
    week: string;
    month: string;
    tasks: string;
    done: string;
    delete: string;
    subscribe: string;
    status: string;
    language: string;
    help: string;
  };
}

const en: BotDict = {
  locale: "en-US",
  pickerName: "🇬🇧 English",
  periods: { MORNING: "morning", NOON: "noon", AFTERNOON: "afternoon", EVENING: "evening", NIGHT: "night" },
  today: "today",
  tomorrow: "tomorrow",
  onDate: (d) => `on ${d}`,
  todayCap: "Today",
  tomorrowCap: "Tomorrow",
  atTime: (t) => `at ${t}`,
  defaultHourPhrase: "at 9am",
  joinAnd: (titles) => titles.join(" and "),
  taskDeleted: (label, title) => `Done! I deleted ${label}« ${title} ».`,
  tasksDeleted: (titles) => `Done! I deleted ${titles}.`,
  taskDone: (title) => `Nice 👍 « ${title} » is marked as done.`,
  tasksDone: (titles) => `Nice 👍 ${titles} are marked as done.`,
  timezoneUpdated: (tz) => `Perfect! Your time zone is now ${tz}.`,
  taskNotFound: "I couldn't find a matching task. Can you be more specific?",
  unknown: "I didn't understand your request.",
  genericError: "Something went wrong.",
  taskCreatedNoDate: (title, tag) => `Got it!\n\nI added « ${title} » to your list.${tag}`,
  taskCreatedTime: (dateLabel, time, title, tag) =>
    `Perfect 👍\n\nI'll remind you ${dateLabel} at ${time} about « ${title} ».${tag}`,
  taskCreatedPeriod: (dateLabel, periodLabel, title, tag) =>
    `Perfect 👍\n\nI'll remind you ${dateLabel} in the ${periodLabel} about « ${title} ».${tag}`,
  taskCreatedDefault: (dateLabel, title, tag) =>
    `Perfect 👍\n\nI'll remind you ${dateLabel} at 9am about « ${title} ».${tag}`,
  tasksCreatedEmpty: "I couldn't create the tasks.",
  tasksCreatedHeader: (count) => `Perfect 👍 I created ${count} tasks:`,
  scheduleNoDate: "no date",
  taskUpdatedDateTime: (title, date, time) => `Updated! « ${title} » is scheduled for ${date} at ${time}.`,
  taskUpdatedDate: (title, date) => `Updated! « ${title} » is scheduled for ${date}.`,
  taskUpdatedGeneric: (title) => `Updated! « ${title} » has been changed.`,
  listEmpty: "You have nothing planned.",
  headerNoDate: "📋 <b>No date</b>",
  ambiguous: (example, lines) =>
    `I found several tasks. Which one? Reply with its number (e.g. « ${example} »).\n\n${lines}`,
  navToday: "📅 Today",
  navTomorrow: "📆 Tomorrow",
  navWeek: "🗗 Week",
  navMonth: "🗓 Month",
  navAll: "📋 All",
  sectionTomorrow: "Tomorrow",
  sectionWeek: "Week",
  sectionMonth: "Month",
  sectionAll: "All tasks",
  welcome: `Hi! I'm TCopilot, your personal assistant.

You can talk to me naturally:
• « Remind me to call the doctor on Tuesday at 3pm »
• « Tomorrow I need to hit the gym and do groceries »
• « I finished my workout »
• « What do I have today? »
• « Delete task 3 »

Commands: /help /today /tomorrow /week /month /tasks /done /delete /subscribe /status /language`,
  help: (price) => `📖 <b>How to use TCopilot</b>

Talk to me naturally, by text or voice 🎙:
• « Remind me to call the doctor on Tuesday at 3pm »
• « Tomorrow: gym and groceries » (several tasks at once)
• « I did the groceries » → marks the task as done
• « Move the doctor call to tomorrow 4pm »
• « What do I have this week? »

🆔 <b>Manage by number</b>
Each task has a number (#1, #2, #3…) shown in your lists.
• <code>/delete 3</code> — deletes task #3
• <code>/done 3</code> — marks task #3 as done
• When several tasks look alike, I ask which one: just reply with its number.

📋 <b>Commands</b>
/today — Today's tasks
/tomorrow — Tomorrow's tasks
/week — Next 7 days
/month — This month's tasks
/tasks — All tasks
/done [n] — Mark done (number, or as a reply to a message)
/delete [n] — Delete (number, or as a reply to a message)
/subscribe — Subscribe to TCopilot Premium (${price} ⭐/month)
/status — Subscription status
/language — Change language

💡 Tip: set your time zone by saying « I'm in Montreal ».`,
  paywall: (price) => `🔒 <b>TCopilot Premium</b>

To use your assistant, you need an active subscription.

✨ <b>${price} ⭐ / month</b> — auto-renewing, cancel anytime in Telegram.

Tap /subscribe to subscribe in a few seconds. ⭐`,
  subscribeButton: (price) => `⭐ Subscribe — ${price} ⭐/month`,
  subscriptionIntro: (price) =>
    `Here's your invoice for TCopilot Premium (${price} ⭐/month). Confirm the payment below to activate your access. ✨`,
  nextRenewal: (date) => `\n\nNext renewal: ${date}.`,
  subscriptionSuccessFirst: (until) =>
    `Thanks and welcome to TCopilot Premium! 🎉\n\nYour access is now active.${until}`,
  subscriptionRenewed: (until) => `Subscription renewed, thanks for your trust! 💙${until}`,
  statusAdmin: "👑 You're an administrator: full, unlimited access.",
  statusWhitelist: "✅ Premium access granted (lifetime). Enjoy! 💙",
  statusSubscription: (date) => `✅ Premium subscription active.\n\nNext renewal: ${date}.`,
  statusTrial: (date, price) =>
    `🎁 Free trial running until ${date}.\n\nSubscribe with /subscribe (${price} ⭐/month) to keep going afterwards.`,
  statusNone: (price) => `❌ No active subscription.\n\nSubscribe with /subscribe (${price} ⭐/month).`,
  granted: (id) => `✅ Premium access granted to user ${id}.`,
  revoked: (id) => `🚫 Premium access removed from user ${id}.`,
  adminUsage: (cmd) => `Usage: /${cmd} <telegram_user_id>`,
  errNoTitle: "I couldn't identify the task title.",
  errInvalidTimezone: (tz) => `The time zone "${tz}" is not valid. Use an IANA time zone (e.g. Europe/Paris).`,
  errTimezoneMissing: "I didn't understand which time zone you want.",
  voiceError: "Sorry, I couldn't understand your voice message. Want to try again or type it?",
  voiceEmpty: "I didn't hear anything in that voice message. Want to try again?",
  voiceHeard: (text) => `🎙 « ${text} »`,
  doneUsage: "Give me the task number (e.g. /done 3) or reply to a task message.",
  deleteUsage: "Give me the task number (e.g. /delete 3) or reply to a task message.",
  reminderDue: (title, timeLabel) => `⏰ In 30 min: ${title}${timeLabel}`,
  reminderAtTime: (time) => ` at ${time}`,
  languagePrompt: "🌍 Choose your language:",
  languageSet: "✅ Language set to English.",
  commands: {
    today: "Today's tasks",
    tomorrow: "Tomorrow's tasks",
    week: "Next 7 days",
    month: "This month's tasks",
    tasks: "All tasks",
    done: "Mark a task done",
    delete: "Delete a task",
    subscribe: "Subscribe to TCopilot Premium",
    status: "My subscription status",
    language: "Change language",
    help: "Help",
  },
};

const fr: BotDict = {
  locale: "fr-FR",
  pickerName: "🇫🇷 Français",
  periods: { MORNING: "matin", NOON: "midi", AFTERNOON: "après-midi", EVENING: "soirée", NIGHT: "nuit" },
  today: "aujourd'hui",
  tomorrow: "demain",
  onDate: (d) => `le ${d}`,
  todayCap: "Aujourd'hui",
  tomorrowCap: "Demain",
  atTime: (t) => `à ${t}`,
  defaultHourPhrase: "à 9h",
  joinAnd: (titles) => titles.join(" et "),
  taskDeleted: (label, title) => `C'est fait ! J'ai supprimé ${label}« ${title} ».`,
  tasksDeleted: (titles) => `C'est fait ! J'ai supprimé ${titles}.`,
  taskDone: (title) => `Bravo 👍 « ${title} » est marquée comme terminée.`,
  tasksDone: (titles) => `Bravo 👍 ${titles} sont marquées comme terminées.`,
  timezoneUpdated: (tz) => `Parfait ! Ton fuseau horaire est maintenant ${tz}.`,
  taskNotFound: "Je n'ai pas trouvé de tâche correspondante. Peux-tu préciser ?",
  unknown: "Je n'ai pas compris ta demande.",
  genericError: "Une erreur est survenue.",
  taskCreatedNoDate: (title, tag) => `C'est noté !\n\nJ'ai ajouté « ${title} » à ta liste.${tag}`,
  taskCreatedTime: (dateLabel, time, title, tag) =>
    `Parfait 👍\n\nJe te rappellerai ${dateLabel} à ${time} pour « ${title} ».${tag}`,
  taskCreatedPeriod: (dateLabel, periodLabel, title, tag) =>
    `Parfait 👍\n\nJe te rappellerai ${dateLabel} ${periodLabel} pour « ${title} ».${tag}`,
  taskCreatedDefault: (dateLabel, title, tag) =>
    `Parfait 👍\n\nJe te rappellerai ${dateLabel} à 9h pour « ${title} ».${tag}`,
  tasksCreatedEmpty: "Je n'ai pas pu créer les tâches.",
  tasksCreatedHeader: (count) => `Parfait 👍 J'ai créé ${count} tâches :`,
  scheduleNoDate: "sans date",
  taskUpdatedDateTime: (title, date, time) => `C'est modifié ! « ${title} » est prévu le ${date} à ${time}.`,
  taskUpdatedDate: (title, date) => `C'est modifié ! « ${title} » est prévu le ${date}.`,
  taskUpdatedGeneric: (title) => `C'est modifié ! « ${title} » a été mise à jour.`,
  listEmpty: "Tu n'as rien de prévu.",
  headerNoDate: "📋 <b>Sans date</b>",
  ambiguous: (example, lines) =>
    `J'ai trouvé plusieurs tâches. Laquelle ? Réponds avec son numéro (ex : « ${example} »).\n\n${lines}`,
  navToday: "📅 Aujourd'hui",
  navTomorrow: "📆 Demain",
  navWeek: "🗗 Semaine",
  navMonth: "🗓 Mois",
  navAll: "📋 Tout",
  sectionTomorrow: "Demain",
  sectionWeek: "Semaine",
  sectionMonth: "Mois",
  sectionAll: "Toutes les tâches",
  welcome: `Salut ! Je suis TCopilot, ton assistant personnel.

Tu peux me parler naturellement :
• « Rappelle-moi d'appeler le médecin mardi à 15h »
• « Demain faut que je fasse la salle et les courses »
• « J'ai terminé ma séance »
• « Qu'est-ce que j'ai aujourd'hui ? »
• « Supprime la tâche 3 »

Commandes : /help /today /tomorrow /week /month /tasks /done /delete /subscribe /status /language`,
  help: (price) => `📖 <b>Comment utiliser TCopilot</b>

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
/subscribe — S'abonner à TCopilot Premium (${price} ⭐/mois)
/status — État de ton abonnement
/language — Changer de langue

💡 Astuce : règle ton fuseau horaire en disant « je suis à Montréal ».`,
  paywall: (price) => `🔒 <b>TCopilot Premium</b>

Pour utiliser ton assistant, il te faut un abonnement actif.

✨ <b>${price} ⭐ / mois</b> — renouvellement automatique, annulable à tout moment dans Telegram.

Appuie sur /subscribe pour t'abonner en quelques secondes. ⭐`,
  subscribeButton: (price) => `⭐ S'abonner — ${price} ⭐/mois`,
  subscriptionIntro: (price) =>
    `Voici ta facture pour TCopilot Premium (${price} ⭐/mois). Confirme le paiement ci-dessous pour activer ton accès. ✨`,
  nextRenewal: (date) => `\n\nProchain renouvellement : ${date}.`,
  subscriptionSuccessFirst: (until) =>
    `Merci et bienvenue dans TCopilot Premium ! 🎉\n\nTon accès est maintenant actif.${until}`,
  subscriptionRenewed: (until) => `Abonnement renouvelé, merci de ta confiance ! 💙${until}`,
  statusAdmin: "👑 Tu es administrateur : accès complet et illimité.",
  statusWhitelist: "✅ Accès Premium offert (à vie). Profite bien ! 💙",
  statusSubscription: (date) => `✅ Abonnement Premium actif.\n\nProchain renouvellement : ${date}.`,
  statusTrial: (date, price) =>
    `🎁 Essai gratuit en cours jusqu'au ${date}.\n\nAbonne-toi avec /subscribe (${price} ⭐/mois) pour continuer ensuite.`,
  statusNone: (price) => `❌ Aucun abonnement actif.\n\nAbonne-toi avec /subscribe (${price} ⭐/mois).`,
  granted: (id) => `✅ Accès Premium offert à l'utilisateur ${id}.`,
  revoked: (id) => `🚫 Accès Premium retiré à l'utilisateur ${id}.`,
  adminUsage: (cmd) => `Usage : /${cmd} <telegram_user_id>`,
  errNoTitle: "Je n'ai pas pu identifier le titre de la tâche.",
  errInvalidTimezone: (tz) => `Le fuseau horaire "${tz}" n'est pas valide. Utilise un fuseau IANA (ex: Europe/Paris).`,
  errTimezoneMissing: "Je n'ai pas compris quel fuseau horaire tu souhaites.",
  voiceError: "Désolé, je n'ai pas réussi à comprendre ton message vocal. Tu peux réessayer ou l'écrire ?",
  voiceEmpty: "Je n'ai rien entendu dans ce vocal. Tu peux réessayer ?",
  voiceHeard: (text) => `🎙 « ${text} »`,
  doneUsage: "Indique le numéro de la tâche (ex : /done 3) ou réponds à un message de tâche.",
  deleteUsage: "Indique le numéro de la tâche (ex : /delete 3) ou réponds à un message de tâche.",
  reminderDue: (title, timeLabel) => `⏰ Dans 30 min : ${title}${timeLabel}`,
  reminderAtTime: (time) => ` à ${time}`,
  languagePrompt: "🌍 Choisis ta langue :",
  languageSet: "✅ Langue réglée sur le français.",
  commands: {
    today: "Tâches du jour",
    tomorrow: "Tâches de demain",
    week: "Tâches des 7 prochains jours",
    month: "Tâches du mois",
    tasks: "Toutes les tâches",
    done: "Marquer une tâche terminée",
    delete: "Supprimer une tâche",
    subscribe: "S'abonner à TCopilot Premium",
    status: "État de mon abonnement",
    language: "Changer de langue",
    help: "Aide",
  },
};

const ru: BotDict = {
  locale: "ru-RU",
  pickerName: "🇷🇺 Русский",
  periods: { MORNING: "утром", NOON: "в полдень", AFTERNOON: "днём", EVENING: "вечером", NIGHT: "ночью" },
  today: "сегодня",
  tomorrow: "завтра",
  onDate: (d) => `${d}`,
  todayCap: "Сегодня",
  tomorrowCap: "Завтра",
  atTime: (t) => `в ${t}`,
  defaultHourPhrase: "в 9:00",
  joinAnd: (titles) => titles.join(" и "),
  taskDeleted: (label, title) => `Готово! Я удалил ${label}« ${title} ».`,
  tasksDeleted: (titles) => `Готово! Я удалил ${titles}.`,
  taskDone: (title) => `Отлично 👍 « ${title} » отмечено как выполнено.`,
  tasksDone: (titles) => `Отлично 👍 ${titles} отмечены как выполнено.`,
  timezoneUpdated: (tz) => `Отлично! Твой часовой пояс теперь ${tz}.`,
  taskNotFound: "Я не нашёл подходящую задачу. Можешь уточнить?",
  unknown: "Я не понял твой запрос.",
  genericError: "Произошла ошибка.",
  taskCreatedNoDate: (title, tag) => `Записал!\n\nЯ добавил « ${title} » в твой список.${tag}`,
  taskCreatedTime: (dateLabel, time, title, tag) =>
    `Отлично 👍\n\nНапомню тебе ${dateLabel} в ${time} о « ${title} ».${tag}`,
  taskCreatedPeriod: (dateLabel, periodLabel, title, tag) =>
    `Отлично 👍\n\nНапомню тебе ${dateLabel} ${periodLabel} о « ${title} ».${tag}`,
  taskCreatedDefault: (dateLabel, title, tag) =>
    `Отлично 👍\n\nНапомню тебе ${dateLabel} в 9:00 о « ${title} ».${tag}`,
  tasksCreatedEmpty: "Не удалось создать задачи.",
  tasksCreatedHeader: (count) => `Отлично 👍 Я создал ${count} задач:`,
  scheduleNoDate: "без даты",
  taskUpdatedDateTime: (title, date, time) => `Изменено! « ${title} » запланировано на ${date} в ${time}.`,
  taskUpdatedDate: (title, date) => `Изменено! « ${title} » запланировано на ${date}.`,
  taskUpdatedGeneric: (title) => `Изменено! « ${title} » обновлено.`,
  listEmpty: "У тебя ничего не запланировано.",
  headerNoDate: "📋 <b>Без даты</b>",
  ambiguous: (example, lines) =>
    `Я нашёл несколько задач. Какую? Ответь её номером (например, « ${example} »).\n\n${lines}`,
  navToday: "📅 Сегодня",
  navTomorrow: "📆 Завтра",
  navWeek: "🗗 Неделя",
  navMonth: "🗓 Месяц",
  navAll: "📋 Все",
  sectionTomorrow: "Завтра",
  sectionWeek: "Неделя",
  sectionMonth: "Месяц",
  sectionAll: "Все задачи",
  welcome: `Привет! Я TCopilot, твой личный помощник.

Можешь писать мне естественно:
• « Напомни позвонить врачу во вторник в 15:00 »
• « Завтра мне нужно в зал и за покупками »
• « Я закончил тренировку »
• « Что у меня сегодня? »
• « Удали задачу 3 »

Команды: /help /today /tomorrow /week /month /tasks /done /delete /subscribe /status /language`,
  help: (price) => `📖 <b>Как пользоваться TCopilot</b>

Пиши мне естественно, текстом или голосом 🎙:
• « Напомни позвонить врачу во вторник в 15:00 »
• « Завтра: зал и покупки » (несколько задач сразу)
• « Я сделал покупки » → отмечает задачу выполненной
• « Перенеси звонок врачу на завтра 16:00 »
• « Что у меня на этой неделе? »

🆔 <b>Управление по номеру</b>
У каждой задачи есть номер (#1, #2, #3…), показанный в списках.
• <code>/delete 3</code> — удаляет задачу #3
• <code>/done 3</code> — отмечает задачу #3 выполненной
• Когда задачи похожи, я спрошу какую: просто ответь её номером.

📋 <b>Команды</b>
/today — Задачи на сегодня
/tomorrow — Задачи на завтра
/week — Следующие 7 дней
/month — Задачи на месяц
/tasks — Все задачи
/done [n] — Отметить выполненной (номер или ответом на сообщение)
/delete [n] — Удалить (номер или ответом на сообщение)
/subscribe — Подписка на TCopilot Premium (${price} ⭐/мес)
/status — Статус подписки
/language — Сменить язык

💡 Совет: задай часовой пояс, написав « я в Монреале ».`,
  paywall: (price) => `🔒 <b>TCopilot Premium</b>

Чтобы пользоваться помощником, нужна активная подписка.

✨ <b>${price} ⭐ / мес</b> — автопродление, можно отменить в Telegram в любой момент.

Нажми /subscribe, чтобы подписаться за пару секунд. ⭐`,
  subscribeButton: (price) => `⭐ Подписаться — ${price} ⭐/мес`,
  subscriptionIntro: (price) =>
    `Вот твой счёт за TCopilot Premium (${price} ⭐/мес). Подтверди оплату ниже, чтобы активировать доступ. ✨`,
  nextRenewal: (date) => `\n\nСледующее продление: ${date}.`,
  subscriptionSuccessFirst: (until) =>
    `Спасибо и добро пожаловать в TCopilot Premium! 🎉\n\nТвой доступ активирован.${until}`,
  subscriptionRenewed: (until) => `Подписка продлена, спасибо за доверие! 💙${until}`,
  statusAdmin: "👑 Ты администратор: полный безлимитный доступ.",
  statusWhitelist: "✅ Premium-доступ предоставлен (навсегда). Пользуйся! 💙",
  statusSubscription: (date) => `✅ Premium-подписка активна.\n\nСледующее продление: ${date}.`,
  statusTrial: (date, price) =>
    `🎁 Бесплатный период до ${date}.\n\nПодпишись через /subscribe (${price} ⭐/мес), чтобы продолжить потом.`,
  statusNone: (price) => `❌ Активной подписки нет.\n\nПодпишись через /subscribe (${price} ⭐/мес).`,
  granted: (id) => `✅ Premium-доступ предоставлен пользователю ${id}.`,
  revoked: (id) => `🚫 Premium-доступ отозван у пользователя ${id}.`,
  adminUsage: (cmd) => `Использование: /${cmd} <telegram_user_id>`,
  errNoTitle: "Не удалось определить название задачи.",
  errInvalidTimezone: (tz) => `Часовой пояс "${tz}" недействителен. Используй пояс IANA (например, Europe/Paris).`,
  errTimezoneMissing: "Я не понял, какой часовой пояс тебе нужен.",
  voiceError: "Извини, я не смог разобрать голосовое сообщение. Попробуешь снова или напишешь?",
  voiceEmpty: "Я ничего не услышал в этом голосовом. Попробуешь снова?",
  voiceHeard: (text) => `🎙 « ${text} »`,
  doneUsage: "Укажи номер задачи (например, /done 3) или ответь на сообщение задачи.",
  deleteUsage: "Укажи номер задачи (например, /delete 3) или ответь на сообщение задачи.",
  reminderDue: (title, timeLabel) => `⏰ Через 30 мин: ${title}${timeLabel}`,
  reminderAtTime: (time) => ` в ${time}`,
  languagePrompt: "🌍 Выбери язык:",
  languageSet: "✅ Язык переключён на русский.",
  commands: {
    today: "Задачи на сегодня",
    tomorrow: "Задачи на завтра",
    week: "Следующие 7 дней",
    month: "Задачи на месяц",
    tasks: "Все задачи",
    done: "Отметить задачу выполненной",
    delete: "Удалить задачу",
    subscribe: "Подписка на TCopilot Premium",
    status: "Статус моей подписки",
    language: "Сменить язык",
    help: "Помощь",
  },
};

const cs: BotDict = {
  locale: "cs-CZ",
  pickerName: "🇨🇿 Čeština",
  periods: { MORNING: "ráno", NOON: "v poledne", AFTERNOON: "odpoledne", EVENING: "večer", NIGHT: "v noci" },
  today: "dnes",
  tomorrow: "zítra",
  onDate: (d) => `${d}`,
  todayCap: "Dnes",
  tomorrowCap: "Zítra",
  atTime: (t) => `v ${t}`,
  defaultHourPhrase: "v 9:00",
  joinAnd: (titles) => titles.join(" a "),
  taskDeleted: (label, title) => `Hotovo! Smazal jsem ${label}« ${title} ».`,
  tasksDeleted: (titles) => `Hotovo! Smazal jsem ${titles}.`,
  taskDone: (title) => `Výborně 👍 « ${title} » je označeno jako hotové.`,
  tasksDone: (titles) => `Výborně 👍 ${titles} jsou označeny jako hotové.`,
  timezoneUpdated: (tz) => `Perfektní! Tvé časové pásmo je nyní ${tz}.`,
  taskNotFound: "Nenašel jsem odpovídající úkol. Můžeš to upřesnit?",
  unknown: "Nerozuměl jsem tvému požadavku.",
  genericError: "Došlo k chybě.",
  taskCreatedNoDate: (title, tag) => `Zapsáno!\n\nPřidal jsem « ${title} » do tvého seznamu.${tag}`,
  taskCreatedTime: (dateLabel, time, title, tag) =>
    `Perfektní 👍\n\nPřipomenu ti ${dateLabel} v ${time} « ${title} ».${tag}`,
  taskCreatedPeriod: (dateLabel, periodLabel, title, tag) =>
    `Perfektní 👍\n\nPřipomenu ti ${dateLabel} ${periodLabel} « ${title} ».${tag}`,
  taskCreatedDefault: (dateLabel, title, tag) =>
    `Perfektní 👍\n\nPřipomenu ti ${dateLabel} v 9:00 « ${title} ».${tag}`,
  tasksCreatedEmpty: "Nepodařilo se vytvořit úkoly.",
  tasksCreatedHeader: (count) => `Perfektní 👍 Vytvořil jsem ${count} úkolů:`,
  scheduleNoDate: "bez data",
  taskUpdatedDateTime: (title, date, time) => `Změněno! « ${title} » je naplánováno na ${date} v ${time}.`,
  taskUpdatedDate: (title, date) => `Změněno! « ${title} » je naplánováno na ${date}.`,
  taskUpdatedGeneric: (title) => `Změněno! « ${title} » bylo aktualizováno.`,
  listEmpty: "Nemáš nic naplánováno.",
  headerNoDate: "📋 <b>Bez data</b>",
  ambiguous: (example, lines) =>
    `Našel jsem několik úkolů. Který? Odpověz jeho číslem (např. « ${example} »).\n\n${lines}`,
  navToday: "📅 Dnes",
  navTomorrow: "📆 Zítra",
  navWeek: "🗗 Týden",
  navMonth: "🗓 Měsíc",
  navAll: "📋 Vše",
  sectionTomorrow: "Zítra",
  sectionWeek: "Týden",
  sectionMonth: "Měsíc",
  sectionAll: "Všechny úkoly",
  welcome: `Ahoj! Jsem TCopilot, tvůj osobní asistent.

Můžeš mi psát přirozeně:
• « Připomeň mi zavolat lékaři v úterý v 15:00 »
• « Zítra musím do posilovny a nakoupit »
• « Dokončil jsem trénink »
• « Co mám dnes? »
• « Smaž úkol 3 »

Příkazy: /help /today /tomorrow /week /month /tasks /done /delete /subscribe /status /language`,
  help: (price) => `📖 <b>Jak používat TCopilot</b>

Piš mi přirozeně, textem nebo hlasem 🎙:
• « Připomeň mi zavolat lékaři v úterý v 15:00 »
• « Zítra: posilovna a nákup » (více úkolů najednou)
• « Nakoupil jsem » → označí úkol jako hotový
• « Přesuň hovor lékaři na zítra 16:00 »
• « Co mám tento týden? »

🆔 <b>Správa podle čísla</b>
Každý úkol má číslo (#1, #2, #3…) zobrazené v seznamech.
• <code>/delete 3</code> — smaže úkol #3
• <code>/done 3</code> — označí úkol #3 jako hotový
• Když jsou úkoly podobné, zeptám se který: stačí odpovědět číslem.

📋 <b>Příkazy</b>
/today — Dnešní úkoly
/tomorrow — Zítřejší úkoly
/week — Příštích 7 dní
/month — Úkoly tohoto měsíce
/tasks — Všechny úkoly
/done [n] — Označit hotové (číslo nebo odpovědí na zprávu)
/delete [n] — Smazat (číslo nebo odpovědí na zprávu)
/subscribe — Předplatné TCopilot Premium (${price} ⭐/měsíc)
/status — Stav předplatného
/language — Změnit jazyk

💡 Tip: nastav si časové pásmo třeba « jsem v Montrealu ».`,
  paywall: (price) => `🔒 <b>TCopilot Premium</b>

Pro používání asistenta potřebuješ aktivní předplatné.

✨ <b>${price} ⭐ / měsíc</b> — automatické obnovení, lze kdykoli zrušit v Telegramu.

Klepni na /subscribe a předplať si to během pár vteřin. ⭐`,
  subscribeButton: (price) => `⭐ Předplatit — ${price} ⭐/měsíc`,
  subscriptionIntro: (price) =>
    `Tady je tvá faktura za TCopilot Premium (${price} ⭐/měsíc). Potvrď platbu níže pro aktivaci přístupu. ✨`,
  nextRenewal: (date) => `\n\nDalší obnovení: ${date}.`,
  subscriptionSuccessFirst: (until) =>
    `Děkujeme a vítej v TCopilot Premium! 🎉\n\nTvůj přístup je nyní aktivní.${until}`,
  subscriptionRenewed: (until) => `Předplatné obnoveno, díky za důvěru! 💙${until}`,
  statusAdmin: "👑 Jsi administrátor: plný neomezený přístup.",
  statusWhitelist: "✅ Premium přístup zdarma (doživotně). Užívej! 💙",
  statusSubscription: (date) => `✅ Premium předplatné aktivní.\n\nDalší obnovení: ${date}.`,
  statusTrial: (date, price) =>
    `🎁 Zkušební verze běží do ${date}.\n\nPředplať si /subscribe (${price} ⭐/měsíc), abys mohl pokračovat.`,
  statusNone: (price) => `❌ Žádné aktivní předplatné.\n\nPředplať si /subscribe (${price} ⭐/měsíc).`,
  granted: (id) => `✅ Premium přístup udělen uživateli ${id}.`,
  revoked: (id) => `🚫 Premium přístup odebrán uživateli ${id}.`,
  adminUsage: (cmd) => `Použití: /${cmd} <telegram_user_id>`,
  errNoTitle: "Nepodařilo se určit název úkolu.",
  errInvalidTimezone: (tz) => `Časové pásmo "${tz}" není platné. Použij pásmo IANA (např. Europe/Paris).`,
  errTimezoneMissing: "Nerozuměl jsem, jaké časové pásmo chceš.",
  voiceError: "Promiň, nepodařilo se mi rozumět hlasové zprávě. Zkusíš to znovu nebo napíšeš?",
  voiceEmpty: "V té hlasové zprávě jsem nic neslyšel. Zkusíš to znovu?",
  voiceHeard: (text) => `🎙 « ${text} »`,
  doneUsage: "Zadej číslo úkolu (např. /done 3) nebo odpověz na zprávu úkolu.",
  deleteUsage: "Zadej číslo úkolu (např. /delete 3) nebo odpověz na zprávu úkolu.",
  reminderDue: (title, timeLabel) => `⏰ Za 30 min: ${title}${timeLabel}`,
  reminderAtTime: (time) => ` v ${time}`,
  languagePrompt: "🌍 Vyber si jazyk:",
  languageSet: "✅ Jazyk nastaven na češtinu.",
  commands: {
    today: "Dnešní úkoly",
    tomorrow: "Zítřejší úkoly",
    week: "Příštích 7 dní",
    month: "Úkoly tohoto měsíce",
    tasks: "Všechny úkoly",
    done: "Označit úkol jako hotový",
    delete: "Smazat úkol",
    subscribe: "Předplatné TCopilot Premium",
    status: "Stav mého předplatného",
    language: "Změnit jazyk",
    help: "Nápověda",
  },
};

const es: BotDict = {
  locale: "es-ES",
  pickerName: "🇪🇸 Español",
  periods: { MORNING: "por la mañana", NOON: "al mediodía", AFTERNOON: "por la tarde", EVENING: "por la noche", NIGHT: "de noche" },
  today: "hoy",
  tomorrow: "mañana",
  onDate: (d) => `el ${d}`,
  todayCap: "Hoy",
  tomorrowCap: "Mañana",
  atTime: (t) => `a las ${t}`,
  defaultHourPhrase: "a las 9h",
  joinAnd: (titles) => titles.join(" y "),
  taskDeleted: (label, title) => `¡Hecho! He eliminado ${label}« ${title} ».`,
  tasksDeleted: (titles) => `¡Hecho! He eliminado ${titles}.`,
  taskDone: (title) => `¡Bien! 👍 « ${title} » está marcada como completada.`,
  tasksDone: (titles) => `¡Bien! 👍 ${titles} están marcadas como completadas.`,
  timezoneUpdated: (tz) => `¡Perfecto! Tu zona horaria ahora es ${tz}.`,
  taskNotFound: "No he encontrado una tarea correspondiente. ¿Puedes precisar?",
  unknown: "No he entendido tu petición.",
  genericError: "Ha ocurrido un error.",
  taskCreatedNoDate: (title, tag) => `¡Anotado!\n\nHe añadido « ${title} » a tu lista.${tag}`,
  taskCreatedTime: (dateLabel, time, title, tag) =>
    `Perfecto 👍\n\nTe recordaré ${dateLabel} a las ${time} « ${title} ».${tag}`,
  taskCreatedPeriod: (dateLabel, periodLabel, title, tag) =>
    `Perfecto 👍\n\nTe recordaré ${dateLabel} ${periodLabel} « ${title} ».${tag}`,
  taskCreatedDefault: (dateLabel, title, tag) =>
    `Perfecto 👍\n\nTe recordaré ${dateLabel} a las 9h « ${title} ».${tag}`,
  tasksCreatedEmpty: "No he podido crear las tareas.",
  tasksCreatedHeader: (count) => `Perfecto 👍 He creado ${count} tareas:`,
  scheduleNoDate: "sin fecha",
  taskUpdatedDateTime: (title, date, time) => `¡Modificado! « ${title} » está previsto el ${date} a las ${time}.`,
  taskUpdatedDate: (title, date) => `¡Modificado! « ${title} » está previsto el ${date}.`,
  taskUpdatedGeneric: (title) => `¡Modificado! « ${title} » se ha actualizado.`,
  listEmpty: "No tienes nada previsto.",
  headerNoDate: "📋 <b>Sin fecha</b>",
  ambiguous: (example, lines) =>
    `He encontrado varias tareas. ¿Cuál? Responde con su número (ej.: « ${example} »).\n\n${lines}`,
  navToday: "📅 Hoy",
  navTomorrow: "📆 Mañana",
  navWeek: "🗗 Semana",
  navMonth: "🗓 Mes",
  navAll: "📋 Todo",
  sectionTomorrow: "Mañana",
  sectionWeek: "Semana",
  sectionMonth: "Mes",
  sectionAll: "Todas las tareas",
  welcome: `¡Hola! Soy TCopilot, tu asistente personal.

Puedes hablarme con naturalidad:
• « Recuérdame llamar al médico el martes a las 15h »
• « Mañana tengo que ir al gimnasio y hacer la compra »
• « He terminado mi entrenamiento »
• « ¿Qué tengo hoy? »
• « Elimina la tarea 3 »

Comandos: /help /today /tomorrow /week /month /tasks /done /delete /subscribe /status /language`,
  help: (price) => `📖 <b>Cómo usar TCopilot</b>

Háblame con naturalidad, por texto o voz 🎙:
• « Recuérdame llamar al médico el martes a las 15h »
• « Mañana: gimnasio y compra » (varias tareas a la vez)
• « He hecho la compra » → marca la tarea como completada
• « Mueve la llamada al médico a mañana 16h »
• « ¿Qué tengo esta semana? »

🆔 <b>Gestionar por número</b>
Cada tarea tiene un número (#1, #2, #3…) mostrado en tus listas.
• <code>/delete 3</code> — elimina la tarea #3
• <code>/done 3</code> — marca la tarea #3 como completada
• Cuando varias tareas se parecen, te pregunto cuál: responde con su número.

📋 <b>Comandos</b>
/today — Tareas de hoy
/tomorrow — Tareas de mañana
/week — Próximos 7 días
/month — Tareas del mes
/tasks — Todas las tareas
/done [n] — Marcar completada (número o respondiendo a un mensaje)
/delete [n] — Eliminar (número o respondiendo a un mensaje)
/subscribe — Suscribirte a TCopilot Premium (${price} ⭐/mes)
/status — Estado de tu suscripción
/language — Cambiar idioma

💡 Consejo: ajusta tu zona horaria diciendo « estoy en Montreal ».`,
  paywall: (price) => `🔒 <b>TCopilot Premium</b>

Para usar tu asistente necesitas una suscripción activa.

✨ <b>${price} ⭐ / mes</b> — renovación automática, cancelable en cualquier momento en Telegram.

Pulsa /subscribe para suscribirte en unos segundos. ⭐`,
  subscribeButton: (price) => `⭐ Suscribirse — ${price} ⭐/mes`,
  subscriptionIntro: (price) =>
    `Aquí está tu factura de TCopilot Premium (${price} ⭐/mes). Confirma el pago abajo para activar tu acceso. ✨`,
  nextRenewal: (date) => `\n\nPróxima renovación: ${date}.`,
  subscriptionSuccessFirst: (until) =>
    `¡Gracias y bienvenido a TCopilot Premium! 🎉\n\nTu acceso ya está activo.${until}`,
  subscriptionRenewed: (until) => `Suscripción renovada, ¡gracias por tu confianza! 💙${until}`,
  statusAdmin: "👑 Eres administrador: acceso completo e ilimitado.",
  statusWhitelist: "✅ Acceso Premium gratis (de por vida). ¡Disfruta! 💙",
  statusSubscription: (date) => `✅ Suscripción Premium activa.\n\nPróxima renovación: ${date}.`,
  statusTrial: (date, price) =>
    `🎁 Prueba gratuita hasta el ${date}.\n\nSuscríbete con /subscribe (${price} ⭐/mes) para continuar después.`,
  statusNone: (price) => `❌ Ninguna suscripción activa.\n\nSuscríbete con /subscribe (${price} ⭐/mes).`,
  granted: (id) => `✅ Acceso Premium concedido al usuario ${id}.`,
  revoked: (id) => `🚫 Acceso Premium retirado al usuario ${id}.`,
  adminUsage: (cmd) => `Uso: /${cmd} <telegram_user_id>`,
  errNoTitle: "No he podido identificar el título de la tarea.",
  errInvalidTimezone: (tz) => `La zona horaria "${tz}" no es válida. Usa una zona IANA (ej.: Europe/Paris).`,
  errTimezoneMissing: "No he entendido qué zona horaria quieres.",
  voiceError: "Lo siento, no he podido entender tu mensaje de voz. ¿Lo intentas de nuevo o lo escribes?",
  voiceEmpty: "No he oído nada en ese mensaje de voz. ¿Lo intentas de nuevo?",
  voiceHeard: (text) => `🎙 « ${text} »`,
  doneUsage: "Indica el número de la tarea (ej.: /done 3) o responde a un mensaje de tarea.",
  deleteUsage: "Indica el número de la tarea (ej.: /delete 3) o responde a un mensaje de tarea.",
  reminderDue: (title, timeLabel) => `⏰ En 30 min: ${title}${timeLabel}`,
  reminderAtTime: (time) => ` a las ${time}`,
  languagePrompt: "🌍 Elige tu idioma:",
  languageSet: "✅ Idioma configurado en español.",
  commands: {
    today: "Tareas de hoy",
    tomorrow: "Tareas de mañana",
    week: "Próximos 7 días",
    month: "Tareas del mes",
    tasks: "Todas las tareas",
    done: "Marcar una tarea completada",
    delete: "Eliminar una tarea",
    subscribe: "Suscribirte a TCopilot Premium",
    status: "Estado de mi suscripción",
    language: "Cambiar idioma",
    help: "Ayuda",
  },
};

const it: BotDict = {
  locale: "it-IT",
  pickerName: "🇮🇹 Italiano",
  periods: { MORNING: "al mattino", NOON: "a mezzogiorno", AFTERNOON: "nel pomeriggio", EVENING: "in serata", NIGHT: "di notte" },
  today: "oggi",
  tomorrow: "domani",
  onDate: (d) => `il ${d}`,
  todayCap: "Oggi",
  tomorrowCap: "Domani",
  atTime: (t) => `alle ${t}`,
  defaultHourPhrase: "alle 9",
  joinAnd: (titles) => titles.join(" e "),
  taskDeleted: (label, title) => `Fatto! Ho eliminato ${label}« ${title} ».`,
  tasksDeleted: (titles) => `Fatto! Ho eliminato ${titles}.`,
  taskDone: (title) => `Bravo 👍 « ${title} » è segnata come completata.`,
  tasksDone: (titles) => `Bravo 👍 ${titles} sono segnate come completate.`,
  timezoneUpdated: (tz) => `Perfetto! Il tuo fuso orario ora è ${tz}.`,
  taskNotFound: "Non ho trovato un'attività corrispondente. Puoi precisare?",
  unknown: "Non ho capito la tua richiesta.",
  genericError: "Si è verificato un errore.",
  taskCreatedNoDate: (title, tag) => `Annotato!\n\nHo aggiunto « ${title} » alla tua lista.${tag}`,
  taskCreatedTime: (dateLabel, time, title, tag) =>
    `Perfetto 👍\n\nTi ricorderò ${dateLabel} alle ${time} di « ${title} ».${tag}`,
  taskCreatedPeriod: (dateLabel, periodLabel, title, tag) =>
    `Perfetto 👍\n\nTi ricorderò ${dateLabel} ${periodLabel} di « ${title} ».${tag}`,
  taskCreatedDefault: (dateLabel, title, tag) =>
    `Perfetto 👍\n\nTi ricorderò ${dateLabel} alle 9 di « ${title} ».${tag}`,
  tasksCreatedEmpty: "Non sono riuscito a creare le attività.",
  tasksCreatedHeader: (count) => `Perfetto 👍 Ho creato ${count} attività:`,
  scheduleNoDate: "senza data",
  taskUpdatedDateTime: (title, date, time) => `Modificato! « ${title} » è previsto il ${date} alle ${time}.`,
  taskUpdatedDate: (title, date) => `Modificato! « ${title} » è previsto il ${date}.`,
  taskUpdatedGeneric: (title) => `Modificato! « ${title} » è stato aggiornato.`,
  listEmpty: "Non hai nulla in programma.",
  headerNoDate: "📋 <b>Senza data</b>",
  ambiguous: (example, lines) =>
    `Ho trovato diverse attività. Quale? Rispondi con il suo numero (es.: « ${example} »).\n\n${lines}`,
  navToday: "📅 Oggi",
  navTomorrow: "📆 Domani",
  navWeek: "🗗 Settimana",
  navMonth: "🗓 Mese",
  navAll: "📋 Tutto",
  sectionTomorrow: "Domani",
  sectionWeek: "Settimana",
  sectionMonth: "Mese",
  sectionAll: "Tutte le attività",
  welcome: `Ciao! Sono TCopilot, il tuo assistente personale.

Puoi parlarmi in modo naturale:
• « Ricordami di chiamare il medico martedì alle 15 »
• « Domani devo andare in palestra e fare la spesa »
• « Ho finito il mio allenamento »
• « Cosa ho oggi? »
• « Elimina l'attività 3 »

Comandi: /help /today /tomorrow /week /month /tasks /done /delete /subscribe /status /language`,
  help: (price) => `📖 <b>Come usare TCopilot</b>

Parlami in modo naturale, con testo o voce 🎙:
• « Ricordami di chiamare il medico martedì alle 15 »
• « Domani: palestra e spesa » (più attività in una volta)
• « Ho fatto la spesa » → segna l'attività come completata
• « Sposta la chiamata al medico a domani alle 16 »
• « Cosa ho questa settimana? »

🆔 <b>Gestire per numero</b>
Ogni attività ha un numero (#1, #2, #3…) mostrato nelle tue liste.
• <code>/delete 3</code> — elimina l'attività #3
• <code>/done 3</code> — segna l'attività #3 come completata
• Quando più attività si somigliano, ti chiedo quale: rispondi con il suo numero.

📋 <b>Comandi</b>
/today — Attività di oggi
/tomorrow — Attività di domani
/week — Prossimi 7 giorni
/month — Attività del mese
/tasks — Tutte le attività
/done [n] — Segna completata (numero o rispondendo a un messaggio)
/delete [n] — Elimina (numero o rispondendo a un messaggio)
/subscribe — Abbonati a TCopilot Premium (${price} ⭐/mese)
/status — Stato dell'abbonamento
/language — Cambia lingua

💡 Suggerimento: imposta il fuso orario dicendo « sono a Montreal ».`,
  paywall: (price) => `🔒 <b>TCopilot Premium</b>

Per usare il tuo assistente serve un abbonamento attivo.

✨ <b>${price} ⭐ / mese</b> — rinnovo automatico, annullabile in qualsiasi momento su Telegram.

Tocca /subscribe per abbonarti in pochi secondi. ⭐`,
  subscribeButton: (price) => `⭐ Abbonati — ${price} ⭐/mese`,
  subscriptionIntro: (price) =>
    `Ecco la tua fattura per TCopilot Premium (${price} ⭐/mese). Conferma il pagamento qui sotto per attivare l'accesso. ✨`,
  nextRenewal: (date) => `\n\nProssimo rinnovo: ${date}.`,
  subscriptionSuccessFirst: (until) =>
    `Grazie e benvenuto in TCopilot Premium! 🎉\n\nIl tuo accesso è ora attivo.${until}`,
  subscriptionRenewed: (until) => `Abbonamento rinnovato, grazie per la fiducia! 💙${until}`,
  statusAdmin: "👑 Sei amministratore: accesso completo e illimitato.",
  statusWhitelist: "✅ Accesso Premium gratuito (a vita). Buon divertimento! 💙",
  statusSubscription: (date) => `✅ Abbonamento Premium attivo.\n\nProssimo rinnovo: ${date}.`,
  statusTrial: (date, price) =>
    `🎁 Prova gratuita in corso fino al ${date}.\n\nAbbonati con /subscribe (${price} ⭐/mese) per continuare poi.`,
  statusNone: (price) => `❌ Nessun abbonamento attivo.\n\nAbbonati con /subscribe (${price} ⭐/mese).`,
  granted: (id) => `✅ Accesso Premium concesso all'utente ${id}.`,
  revoked: (id) => `🚫 Accesso Premium rimosso all'utente ${id}.`,
  adminUsage: (cmd) => `Uso: /${cmd} <telegram_user_id>`,
  errNoTitle: "Non sono riuscito a identificare il titolo dell'attività.",
  errInvalidTimezone: (tz) => `Il fuso orario "${tz}" non è valido. Usa un fuso IANA (es.: Europe/Paris).`,
  errTimezoneMissing: "Non ho capito quale fuso orario vuoi.",
  voiceError: "Scusa, non sono riuscito a capire il tuo messaggio vocale. Riprovi o lo scrivi?",
  voiceEmpty: "Non ho sentito nulla in quel vocale. Riprovi?",
  voiceHeard: (text) => `🎙 « ${text} »`,
  doneUsage: "Indica il numero dell'attività (es.: /done 3) o rispondi a un messaggio di attività.",
  deleteUsage: "Indica il numero dell'attività (es.: /delete 3) o rispondi a un messaggio di attività.",
  reminderDue: (title, timeLabel) => `⏰ Tra 30 min: ${title}${timeLabel}`,
  reminderAtTime: (time) => ` alle ${time}`,
  languagePrompt: "🌍 Scegli la tua lingua:",
  languageSet: "✅ Lingua impostata su italiano.",
  commands: {
    today: "Attività di oggi",
    tomorrow: "Attività di domani",
    week: "Prossimi 7 giorni",
    month: "Attività del mese",
    tasks: "Tutte le attività",
    done: "Segna un'attività completata",
    delete: "Elimina un'attività",
    subscribe: "Abbonati a TCopilot Premium",
    status: "Stato del mio abbonamento",
    language: "Cambia lingua",
    help: "Aiuto",
  },
};

const DICTS: Record<Language, BotDict> = { en, fr, ru, cs, es, it };

/** Renvoie le dictionnaire du bot pour une langue (repli sur l'anglais). */
export function getBotDict(language: string | null | undefined): BotDict {
  const lang = resolveLanguage(language);
  return DICTS[lang] ?? DICTS[DEFAULT_LANGUAGE];
}
