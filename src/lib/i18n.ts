export const LANGUAGES = [
  { code: "en", label: "EN" },
  { code: "fr", label: "FR" },
  { code: "ru", label: "RU" },
  { code: "cs", label: "CZ" },
  { code: "es", label: "ES" },
  { code: "it", label: "IT" },
  { code: "zh", label: "中文" },
  { code: "tr", label: "TR" },
] as const;

export type Language = (typeof LANGUAGES)[number]["code"];

export const DEFAULT_LANGUAGE: Language = "en";

export interface ChatMessage {
  from: "user" | "bot";
  text: string;
}

export interface TitledItem {
  title: string;
  description: string;
}

export interface CommandItem {
  command: string;
  description: string;
}

export interface Dictionary {
  htmlLang: string;
  nav: {
    how: string;
    features: string;
    examples: string;
    commands: string;
    contact: string;
  };
  openTelegram: string;
  hero: {
    badge: string;
    titleLead: string;
    titleHighlight: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
    bullets: [string, string, string];
    online: string;
  };
  chat: ChatMessage[];
  steps: { title: string; subtitle: string; items: TitledItem[] };
  features: { title: string; subtitle: string; items: TitledItem[] };
  commands: {
    title: string;
    subtitle: string;
    items: CommandItem[];
    note: string;
  };
  examples: { title: string; subtitle: string; items: string[] };
  privacy: { title: string; subtitle: string; items: TitledItem[] };
  affiliation: {
    badge: string;
    title: string;
    subtitle: string;
    deadline: string;
    steps: TitledItem[];
    cta: string;
  };
  cta: { title: string; subtitle: string; button: string };
  contact: {
    title: string;
    subtitle: string;
    description: string;
    emailLabel: string;
    cta: string;
    responseNote: string;
    back: string;
  };
  footer: { tagline: string; features: string; contact: string };
}

export const translations: Record<Language, Dictionary> = {
  en: {
    htmlLang: "en",
    nav: {
      how: "How it works",
      features: "Features",
      examples: "Examples",
      commands: "Commands",
      contact: "Contact",
    },
    openTelegram: "Open in Telegram",
    hero: {
      badge: "Powered by AI",
      titleLead: "Your personal copilot,",
      titleHighlight: "on Telegram",
      subtitle:
        "Telegram Copilot is like a calendar — but magic, and it talks to you. That's all it does: write your tasks, reminders and appointments in plain words, and get a nudge 30 minutes before. Nothing else.",
      ctaPrimary: "Start on Telegram",
      ctaSecondary: "See how it works",
      bullets: [
        "A magic talking agenda",
        "Reminder 30 min before",
        "Private & anonymous",
      ],
      online: "online",
    },
    chat: [
      { from: "user", text: "Remind me to call the doctor on Tuesday at 3pm" },
      {
        from: "bot",
        text: "Got it 👍 I'll remind you Tuesday at 15:00 about « Call the doctor ».",
      },
      { from: "user", text: "Tomorrow I need to hit the gym and do groceries" },
      {
        from: "bot",
        text: "Done 👍 I created 2 tasks:\n🏋️ Gym session — morning\n🛒 Groceries — morning",
      },
      { from: "user", text: "I turned off the AC" },
      { from: "bot", text: "Nice 👍 « Turn off the AC » is marked as done." },
    ],
    steps: {
      title: "How it works",
      subtitle:
        "Three steps, zero friction. No forms, no app: just a conversation.",
      items: [
        {
          title: "Open the bot",
          description:
            "Start a conversation with Telegram Copilot on Telegram in one click.",
        },
        {
          title: "Write naturally",
          description:
            "Tell it what you need to do, like an assistant. No syntax to learn.",
        },
        {
          title: "Let it handle it",
          description:
            "It plans, reminds you at the right time and keeps your list up to date automatically.",
        },
      ],
    },
    features: {
      title: "Everything you need",
      subtitle:
        "Real natural-language understanding, serving your daily organization.",
      items: [
        {
          title: "Natural language",
          description:
            "Talk to it normally, in your own language: « Remind me to call the doctor Tuesday at 3pm ». It understands and organizes.",
        },
        {
          title: "Automatic reminders",
          description:
            "Get a notification 30 minutes before each scheduled task, right in Telegram.",
        },
        {
          title: "Several tasks at once",
          description:
            "« Tomorrow I need to do the gym and groceries » creates all your tasks in a single sentence.",
        },
        {
          title: "Move & complete",
          description:
            "« Move the call to tomorrow 4pm » or « I turned off the AC »: it updates and checks it off for you.",
        },
        {
          title: "Conversation memory",
          description:
            "It keeps the context of recent exchanges and asks you to clarify when it's ambiguous.",
        },
        {
          title: "Time zone",
          description:
            "Set your time zone and all your reminders fire at the right time, wherever you are.",
        },
      ],
    },
    commands: {
      title: "For geeks: direct commands",
      subtitle:
        "Prefer shortcuts? Beyond natural language, the bot also understands direct commands.",
      items: [
        { command: "/today", description: "See everything planned for today." },
        { command: "/tomorrow", description: "See what's coming tomorrow." },
        { command: "/week", description: "Your agenda for the week." },
        { command: "/tasks", description: "List all your open tasks." },
        { command: "/done", description: "Mark a task as completed." },
        { command: "/delete", description: "Delete a task." },
      ],
      note: "And to create something? Just write it naturally — no command needed.",
    },
    examples: {
      title: "Just tell it things",
      subtitle: "Here are examples of messages Telegram Copilot understands perfectly.",
      items: [
        "Remind me to call the doctor on Tuesday at 3pm",
        "Tomorrow I need to hit the gym and do groceries",
        "Move the meeting to Thursday morning",
        "What do I have today?",
        "I finished my workout",
        "Delete tomorrow's meeting",
      ],
    },
    privacy: {
      title: "Anonymous & private by design",
      subtitle:
        "Your life is yours. Telegram Copilot is built to stay discreet.",
      items: [
        {
          title: "No phone number, no email",
          description:
            "You start straight from Telegram. We never ask for a personal identity to use the bot.",
        },
        {
          title: "Only your tasks",
          description:
            "We store only what's needed to run your reminders — nothing more, no tracking of your habits.",
        },
        {
          title: "Never resold",
          description:
            "Your data is never sold or shared with advertisers. Ever.",
        },
        {
          title: "Yours to erase",
          description:
            "Just ask and your data is wiped. You stay in control at all times.",
        },
      ],
    },
    affiliation: {
      badge: "Limited offer — until September",
      title: "Invite friends, earn 50%",
      subtitle:
        "For every friend you refer who subscribes to Telegram Copilot, you earn 50% of their monthly revenue — directly and automatically, until September.",
      deadline: "Offer valid until September 2026",
      steps: [
        {
          title: "Get your link",
          description:
            "Open the bot in Telegram, go to its Affiliate Program, and copy your unique referral link.",
        },
        {
          title: "Share it",
          description:
            "Share your link with your friends, community, or social media. No limit on referrals.",
        },
        {
          title: "Earn 50%",
          description:
            "For each subscription taken via your link, you receive 50% of the revenue every month.",
        },
      ],
      cta: "Get my referral link",
    },
    cta: {
      title: "Ready to delegate your organization?",
      subtitle:
        "Open Telegram Copilot on Telegram and send your first message. It's free and instant.",
      button: "Open in Telegram",
    },
    contact: {
      title: "Contact & support",
      subtitle: "A question, a bug, an idea? We're here.",
      description:
        "The fastest way to reach us is by email. Tell us what's going on and we'll get back to you.",
      emailLabel: "Email us",
      cta: "Send an email",
      responseNote: "We typically respond within 24–48 hours.",
      back: "Back to home",
    },
    footer: {
      tagline: "Your personal copilot on Telegram.",
      features: "Features",
      contact: "Contact",
    },
  },

  fr: {
    htmlLang: "fr",
    nav: {
      how: "Fonctionnement",
      features: "Fonctionnalités",
      examples: "Exemples",
      commands: "Commandes",
      contact: "Contact",
    },
    openTelegram: "Ouvrir dans Telegram",
    hero: {
      badge: "Propulsé par l'IA",
      titleLead: "Ton copilote personnel,",
      titleHighlight: "sur Telegram",
      subtitle:
        "Telegram Copilot, c'est comme un agenda — mais magique, et qui te parle. Il ne sert qu'à ça : écris tes tâches, rappels et rendez-vous en langage naturel, et reçois un rappel 30 minutes avant. Rien d'autre.",
      ctaPrimary: "Démarrer sur Telegram",
      ctaSecondary: "Voir comment ça marche",
      bullets: [
        "Un agenda magique qui parle",
        "Rappel 30 min avant",
        "Privé & anonyme",
      ],
      online: "en ligne",
    },
    chat: [
      { from: "user", text: "Rappelle-moi d'appeler le médecin mardi à 15h" },
      {
        from: "bot",
        text: "Parfait 👍 Je te rappellerai mardi à 15:00 pour « Appeler le médecin ».",
      },
      { from: "user", text: "Demain faut que je fasse la salle et les courses" },
      {
        from: "bot",
        text: "Parfait 👍 J'ai créé 2 tâches :\n🏋️ Séance à la salle — matin\n🛒 Faire les courses — matin",
      },
      { from: "user", text: "j'ai éteint la clim" },
      {
        from: "bot",
        text: "Bravo 👍 « Éteindre la clim » est marquée comme terminée.",
      },
    ],
    steps: {
      title: "Comment ça marche",
      subtitle:
        "Trois étapes, zéro friction. Pas de formulaire, pas d'app : juste une conversation.",
      items: [
        {
          title: "Ouvre le bot",
          description:
            "Lance une conversation avec Telegram Copilot sur Telegram en un clic.",
        },
        {
          title: "Écris naturellement",
          description:
            "Dis-lui ce que tu as à faire, comme à un assistant. Pas de syntaxe à apprendre.",
        },
        {
          title: "Laisse-le gérer",
          description:
            "Il planifie, te rappelle au bon moment et garde ta liste à jour automatiquement.",
        },
      ],
    },
    features: {
      title: "Tout ce dont tu as besoin",
      subtitle:
        "Une vraie compréhension du langage naturel, au service de ton organisation quotidienne.",
      items: [
        {
          title: "Langage naturel",
          description:
            "Parle-lui normalement, dans ta langue : « Rappelle-moi d'appeler le médecin mardi à 15h ». Il comprend et organise.",
        },
        {
          title: "Rappels automatiques",
          description:
            "Reçois une notification 30 minutes avant chaque tâche planifiée, directement dans Telegram.",
        },
        {
          title: "Plusieurs tâches d'un coup",
          description:
            "« Demain faut que je fasse la salle et les courses » crée toutes tes tâches en une seule phrase.",
        },
        {
          title: "Déplacer & terminer",
          description:
            "« Déplace l'appel à demain 16h » ou « j'ai éteint la clim » : il met à jour et coche pour toi.",
        },
        {
          title: "Mémoire de conversation",
          description:
            "Il garde le contexte des derniers échanges et te demande de préciser quand c'est ambigu.",
        },
        {
          title: "Fuseau horaire",
          description:
            "Définis ton fuseau et tous tes rappels tombent à la bonne heure, où que tu sois.",
        },
      ],
    },
    commands: {
      title: "Pour les geeks : les commandes",
      subtitle:
        "Tu préfères les raccourcis ? En plus du langage naturel, le bot comprend aussi des commandes directes.",
      items: [
        { command: "/today", description: "Voir tout ce qui est prévu aujourd'hui." },
        { command: "/tomorrow", description: "Voir ce qui arrive demain." },
        { command: "/week", description: "Ton agenda de la semaine." },
        { command: "/tasks", description: "Lister toutes tes tâches en cours." },
        { command: "/done", description: "Marquer une tâche comme terminée." },
        { command: "/delete", description: "Supprimer une tâche." },
      ],
      note: "Et pour créer ? Écris-le simplement, aucune commande nécessaire.",
    },
    examples: {
      title: "Dis-lui simplement les choses",
      subtitle:
        "Voici des exemples de messages que Telegram Copilot comprend parfaitement.",
      items: [
        "Rappelle-moi d'appeler le médecin mardi à 15h",
        "Demain faut que je fasse la salle et les courses",
        "Déplace la réunion à jeudi matin",
        "Qu'est-ce que j'ai aujourd'hui ?",
        "J'ai terminé ma séance",
        "Supprime la réunion de demain",
      ],
    },
    privacy: {
      title: "Anonyme & respectueux de ta vie privée",
      subtitle:
        "Ta vie t'appartient. Telegram Copilot est conçu pour rester discret.",
      items: [
        {
          title: "Ni numéro, ni e-mail",
          description:
            "Tu démarres directement depuis Telegram. On ne te demande aucune identité personnelle pour utiliser le bot.",
        },
        {
          title: "Juste tes tâches",
          description:
            "On ne stocke que le nécessaire pour tes rappels — rien de plus, aucun suivi de tes habitudes.",
        },
        {
          title: "Jamais revendu",
          description:
            "Tes données ne sont jamais vendues ni partagées avec des annonceurs. Jamais.",
        },
        {
          title: "Effaçable à volonté",
          description:
            "Sur simple demande, tes données sont supprimées. Tu gardes le contrôle à tout moment.",
        },
      ],
    },
    affiliation: {
      badge: "Offre limitée — jusqu'en septembre",
      title: "Invite tes amis, gagne 50%",
      subtitle:
        "Pour chaque ami que tu parraines et qui s'abonne à Telegram Copilot, tu gagnes 50% de ses revenus mensuels — directement et automatiquement, jusqu'en septembre.",
      deadline: "Offre valable jusqu'en septembre 2026",
      steps: [
        {
          title: "Obtiens ton lien",
          description:
            "Ouvre le bot dans Telegram, va dans son programme d'affiliation et copie ton lien de parrainage unique.",
        },
        {
          title: "Partage-le",
          description:
            "Partage ton lien avec tes amis, ta communauté ou tes réseaux sociaux. Pas de limite de parrainages.",
        },
        {
          title: "Gagne 50%",
          description:
            "Pour chaque abonnement pris via ton lien, tu reçois 50% des revenus chaque mois.",
        },
      ],
      cta: "Obtenir mon lien de parrainage",
    },
    cta: {
      title: "Prêt à déléguer ton organisation ?",
      subtitle:
        "Ouvre Telegram Copilot sur Telegram et envoie ton premier message. C'est gratuit et immédiat.",
      button: "Ouvrir dans Telegram",
    },
    contact: {
      title: "Contact & support",
      subtitle: "Une question, un bug, une idée ? On est là.",
      description:
        "Le plus rapide pour nous joindre, c'est par e-mail. Explique-nous ta situation et on te répond.",
      emailLabel: "Écris-nous",
      cta: "Envoyer un e-mail",
      responseNote: "On répond généralement sous 24 à 48 heures.",
      back: "Retour à l'accueil",
    },
    footer: {
      tagline: "Ton copilote personnel sur Telegram.",
      features: "Fonctionnalités",
      contact: "Contact",
    },
  },

  ru: {
    htmlLang: "ru",
    nav: {
      how: "Как это работает",
      features: "Возможности",
      examples: "Примеры",
      commands: "Команды",
      contact: "Контакты",
    },
    openTelegram: "Открыть в Telegram",
    hero: {
      badge: "На базе ИИ",
      titleLead: "Твой личный помощник,",
      titleHighlight: "в Telegram",
      subtitle:
        "Telegram Copilot — как ежедневник, только волшебный и говорящий. Он нужен только для этого: пиши задачи, напоминания и встречи обычными словами и получай напоминание за 30 минут. Ничего лишнего.",
      ctaPrimary: "Начать в Telegram",
      ctaSecondary: "Узнать, как это работает",
      bullets: [
        "Волшебный говорящий ежедневник",
        "Напоминание за 30 мин",
        "Приватно и анонимно",
      ],
      online: "в сети",
    },
    chat: [
      { from: "user", text: "Напомни мне позвонить врачу во вторник в 15:00" },
      {
        from: "bot",
        text: "Готово 👍 Напомню во вторник в 15:00 о « Позвонить врачу ».",
      },
      { from: "user", text: "Завтра мне нужно в спортзал и за покупками" },
      {
        from: "bot",
        text: "Готово 👍 Я создал 2 задачи:\n🏋️ Тренировка в зале — утро\n🛒 Покупки — утро",
      },
      { from: "user", text: "Я выключил кондиционер" },
      {
        from: "bot",
        text: "Отлично 👍 « Выключить кондиционер » отмечено как выполнено.",
      },
    ],
    steps: {
      title: "Как это работает",
      subtitle:
        "Три шага, без лишних усилий. Никаких форм и приложений — просто разговор.",
      items: [
        {
          title: "Открой бота",
          description: "Начни разговор с Telegram Copilot в Telegram в один клик.",
        },
        {
          title: "Пиши естественно",
          description:
            "Скажи, что нужно сделать, как ассистенту. Никакого синтаксиса учить не надо.",
        },
        {
          title: "Доверь это ему",
          description:
            "Он планирует, напоминает вовремя и автоматически держит список в актуальном виде.",
        },
      ],
    },
    features: {
      title: "Всё, что тебе нужно",
      subtitle:
        "Настоящее понимание естественного языка на службе твоей ежедневной организации.",
      items: [
        {
          title: "Естественный язык",
          description:
            "Говори с ним как обычно, на своём языке: « Напомни позвонить врачу во вторник в 15:00 ». Он понимает и организует.",
        },
        {
          title: "Автоматические напоминания",
          description:
            "Получай уведомление за 30 минут до каждой запланированной задачи прямо в Telegram.",
        },
        {
          title: "Несколько задач сразу",
          description:
            "« Завтра мне нужно в зал и за покупками » создаёт все задачи одной фразой.",
        },
        {
          title: "Перенести и завершить",
          description:
            "« Перенеси звонок на завтра в 16:00 » или « я выключил кондиционер »: он обновит и отметит за тебя.",
        },
        {
          title: "Память разговора",
          description:
            "Он помнит контекст последних сообщений и просит уточнить, когда неоднозначно.",
        },
        {
          title: "Часовой пояс",
          description:
            "Задай часовой пояс — и все напоминания сработают вовремя, где бы ты ни был.",
        },
      ],
    },
    commands: {
      title: "Для гиков: прямые команды",
      subtitle:
        "Предпочитаешь горячие клавиши? Кроме обычного языка, бот понимает и прямые команды.",
      items: [
        { command: "/today", description: "Показать всё, что запланировано на сегодня." },
        { command: "/tomorrow", description: "Показать, что будет завтра." },
        { command: "/week", description: "Твой план на неделю." },
        { command: "/tasks", description: "Список всех открытых задач." },
        { command: "/done", description: "Отметить задачу выполненной." },
        { command: "/delete", description: "Удалить задачу." },
      ],
      note: "А как создать? Просто напиши обычными словами — команда не нужна.",
    },
    examples: {
      title: "Просто скажи ему",
      subtitle:
        "Вот примеры сообщений, которые Telegram Copilot прекрасно понимает.",
      items: [
        "Напомни мне позвонить врачу во вторник в 15:00",
        "Завтра мне нужно в спортзал и за покупками",
        "Перенеси встречу на утро четверга",
        "Что у меня сегодня?",
        "Я закончил тренировку",
        "Удали завтрашнюю встречу",
      ],
    },
    privacy: {
      title: "Анонимность и приватность по умолчанию",
      subtitle:
        "Твоя жизнь принадлежит тебе. Telegram Copilot создан, чтобы оставаться незаметным.",
      items: [
        {
          title: "Ни номера, ни e-mail",
          description:
            "Ты начинаешь прямо из Telegram. Мы никогда не спрашиваем личные данные для работы с ботом.",
        },
        {
          title: "Только твои задачи",
          description:
            "Мы храним лишь необходимое для напоминаний — ничего больше, без слежки за привычками.",
        },
        {
          title: "Никогда не продаём",
          description:
            "Твои данные никогда не продаются и не передаются рекламодателям. Никогда.",
        },
        {
          title: "Удаляется по запросу",
          description:
            "Достаточно попросить — и твои данные стираются. Контроль всегда у тебя.",
        },
      ],
    },
    affiliation: {
      badge: "Ограниченное предложение — до сентября",
      title: "Приглашай друзей, зарабатывай 50%",
      subtitle:
        "За каждого друга, которого ты пригласишь и кто оформит подписку на Telegram Copilot, ты получаешь 50% его ежемесячного дохода — напрямую и автоматически, до сентября.",
      deadline: "Предложение действительно до сентября 2026",
      steps: [
        {
          title: "Получи ссылку",
          description:
            "Открой бота в Telegram, зайди в его партнёрскую программу и скопируй свою уникальную реферальную ссылку.",
        },
        {
          title: "Поделись ею",
          description:
            "Поделись ссылкой с друзьями, сообществом или в социальных сетях. Количество рефералов не ограничено.",
        },
        {
          title: "Зарабатывай 50%",
          description:
            "За каждую подписку, оформленную по твоей ссылке, ты получаешь 50% дохода каждый месяц.",
        },
      ],
      cta: "Получить реферальную ссылку",
    },
    cta: {
      title: "Готов делегировать свою организацию?",
      subtitle:
        "Открой Telegram Copilot в Telegram и отправь первое сообщение. Это бесплатно и мгновенно.",
      button: "Открыть в Telegram",
    },
    contact: {
      title: "Контакты и поддержка",
      subtitle: "Вопрос, баг или идея? Мы на связи.",
      description:
        "Быстрее всего написать нам на e-mail. Опиши ситуацию — и мы ответим.",
      emailLabel: "Написать нам",
      cta: "Отправить e-mail",
      responseNote: "Обычно отвечаем в течение 24–48 часов.",
      back: "На главную",
    },
    footer: {
      tagline: "Твой личный помощник в Telegram.",
      features: "Возможности",
      contact: "Контакты",
    },
  },

  cs: {
    htmlLang: "cs",
    nav: {
      how: "Jak to funguje",
      features: "Funkce",
      examples: "Příklady",
      commands: "Příkazy",
      contact: "Kontakt",
    },
    openTelegram: "Otevřít v Telegramu",
    hero: {
      badge: "Poháněno AI",
      titleLead: "Tvůj osobní kopilot,",
      titleHighlight: "na Telegramu",
      subtitle:
        "Telegram Copilot je jako diář — ale kouzelný a mluví. Slouží jen k tomu: napiš své úkoly, připomínky a schůzky běžnými slovy a dostaneš připomenutí 30 minut předem. Nic víc.",
      ctaPrimary: "Začít na Telegramu",
      ctaSecondary: "Podívat se, jak to funguje",
      bullets: [
        "Kouzelný mluvící diář",
        "Připomenutí 30 min předem",
        "Soukromé a anonymní",
      ],
      online: "online",
    },
    chat: [
      { from: "user", text: "Připomeň mi zavolat lékaři v úterý v 15:00" },
      {
        from: "bot",
        text: "Hotovo 👍 Připomenu ti v úterý v 15:00 « Zavolat lékaři ».",
      },
      { from: "user", text: "Zítra musím do posilovny a nakoupit" },
      {
        from: "bot",
        text: "Hotovo 👍 Vytvořil jsem 2 úkoly:\n🏋️ Posilovna — ráno\n🛒 Nákup — ráno",
      },
      { from: "user", text: "Vypnul jsem klimatizaci" },
      {
        from: "bot",
        text: "Výborně 👍 « Vypnout klimatizaci » je označeno jako hotové.",
      },
    ],
    steps: {
      title: "Jak to funguje",
      subtitle:
        "Tři kroky, žádné tření. Žádné formuláře, žádná aplikace: jen konverzace.",
      items: [
        {
          title: "Otevři bota",
          description:
            "Spusť konverzaci s Telegram Copilot na Telegramu jedním kliknutím.",
        },
        {
          title: "Piš přirozeně",
          description:
            "Řekni mu, co potřebuješ udělat, jako asistentovi. Žádná syntaxe k učení.",
        },
        {
          title: "Nech to na něm",
          description:
            "Naplánuje, připomene ve správný čas a automaticky udržuje tvůj seznam aktuální.",
        },
      ],
    },
    features: {
      title: "Vše, co potřebuješ",
      subtitle:
        "Skutečné porozumění přirozenému jazyku ve službách tvé každodenní organizace.",
      items: [
        {
          title: "Přirozený jazyk",
          description:
            "Mluv s ním normálně, svým jazykem: « Připomeň mi zavolat lékaři v úterý v 15:00 ». Rozumí a zorganizuje.",
        },
        {
          title: "Automatické připomínky",
          description:
            "Dostaneš upozornění 30 minut před každým naplánovaným úkolem, přímo v Telegramu.",
        },
        {
          title: "Více úkolů najednou",
          description:
            "« Zítra musím do posilovny a nakoupit » vytvoří všechny úkoly jednou větou.",
        },
        {
          title: "Přesunout a dokončit",
          description:
            "« Přesuň hovor na zítra na 16:00 » nebo « vypnul jsem klimatizaci »: aktualizuje a odškrtne za tebe.",
        },
        {
          title: "Paměť konverzace",
          description:
            "Pamatuje si kontext posledních zpráv a požádá o upřesnění, když je to nejednoznačné.",
        },
        {
          title: "Časové pásmo",
          description:
            "Nastav si časové pásmo a všechny připomínky se spustí ve správný čas, ať jsi kdekoli.",
        },
      ],
    },
    commands: {
      title: "Pro geeky: přímé příkazy",
      subtitle:
        "Máš radši zkratky? Kromě přirozeného jazyka bot rozumí i přímým příkazům.",
      items: [
        { command: "/today", description: "Zobraz vše, co máš dnes v plánu." },
        { command: "/tomorrow", description: "Zobraz, co tě čeká zítra." },
        { command: "/week", description: "Tvůj program na týden." },
        { command: "/tasks", description: "Vypiš všechny otevřené úkoly." },
        { command: "/done", description: "Označ úkol jako hotový." },
        { command: "/delete", description: "Smaž úkol." },
      ],
      note: "A jak něco vytvořit? Stačí to napsat běžně — žádný příkaz není potřeba.",
    },
    examples: {
      title: "Stačí mu to říct",
      subtitle:
        "Zde jsou příklady zpráv, kterým Telegram Copilot dokonale rozumí.",
      items: [
        "Připomeň mi zavolat lékaři v úterý v 15:00",
        "Zítra musím do posilovny a nakoupit",
        "Přesuň schůzku na čtvrteční ráno",
        "Co mám dnes?",
        "Dokončil jsem trénink",
        "Smaž zítřejší schůzku",
      ],
    },
    privacy: {
      title: "Anonymní a soukromé už z principu",
      subtitle:
        "Tvůj život patří tobě. Telegram Copilot je navržen tak, aby zůstal diskrétní.",
      items: [
        {
          title: "Žádné číslo, žádný e-mail",
          description:
            "Začínáš přímo z Telegramu. Nikdy nechceme osobní identitu k používání bota.",
        },
        {
          title: "Jen tvé úkoly",
          description:
            "Ukládáme jen to nutné pro tvé připomínky — nic víc, žádné sledování zvyků.",
        },
        {
          title: "Nikdy neprodáváme",
          description:
            "Tvá data se nikdy neprodávají ani nesdílejí s inzerenty. Nikdy.",
        },
        {
          title: "Smazatelné na požádání",
          description:
            "Stačí požádat a tvá data se vymažou. Kontrolu máš vždy ty.",
        },
      ],
    },
    affiliation: {
      badge: "Omezená nabídka — do září",
      title: "Pozvi přátele, vydělej 50 %",
      subtitle:
        "Za každého přítele, kterého doporučíš a který si předplatí Telegram Copilot, získáš 50 % jeho měsíčních příjmů — přímo a automaticky, do září.",
      deadline: "Nabídka platí do září 2026",
      steps: [
        {
          title: "Získej odkaz",
          description:
            "Otevři bota v Telegramu, přejdi do jeho affiliate programu a zkopíruj svůj unikátní referenční odkaz.",
        },
        {
          title: "Sdílej ho",
          description:
            "Sdílej odkaz s přáteli, komunitou nebo na sociálních sítích. Počet doporučení je neomezený.",
        },
        {
          title: "Vydělej 50 %",
          description:
            "Za každé předplatné přes tvůj odkaz obdržíš 50 % příjmů každý měsíc.",
        },
      ],
      cta: "Získat referenční odkaz",
    },
    cta: {
      title: "Připraven delegovat svou organizaci?",
      subtitle:
        "Otevři Telegram Copilot na Telegramu a pošli svou první zprávu. Je to zdarma a okamžité.",
      button: "Otevřít v Telegramu",
    },
    contact: {
      title: "Kontakt a podpora",
      subtitle: "Dotaz, chyba nebo nápad? Jsme tu.",
      description:
        "Nejrychleji nás zastihneš e-mailem. Popiš situaci a ozveme se ti.",
      emailLabel: "Napiš nám",
      cta: "Odeslat e-mail",
      responseNote: "Obvykle odpovídáme do 24–48 hodin.",
      back: "Zpět na úvod",
    },
    footer: {
      tagline: "Tvůj osobní kopilot na Telegramu.",
      features: "Funkce",
      contact: "Kontakt",
    },
  },

  es: {
    htmlLang: "es",
    nav: {
      how: "Cómo funciona",
      features: "Funciones",
      examples: "Ejemplos",
      commands: "Comandos",
      contact: "Contacto",
    },
    openTelegram: "Abrir en Telegram",
    hero: {
      badge: "Impulsado por IA",
      titleLead: "Tu copiloto personal,",
      titleHighlight: "en Telegram",
      subtitle:
        "Telegram Copilot es como una agenda — pero mágica, y que te habla. Solo sirve para eso: escribe tus tareas, recordatorios y citas con palabras normales y recibe un aviso 30 minutos antes. Nada más.",
      ctaPrimary: "Empezar en Telegram",
      ctaSecondary: "Ver cómo funciona",
      bullets: [
        "Una agenda mágica que habla",
        "Aviso 30 min antes",
        "Privado y anónimo",
      ],
      online: "en línea",
    },
    chat: [
      { from: "user", text: "Recuérdame llamar al médico el martes a las 15h" },
      {
        from: "bot",
        text: "Perfecto 👍 Te recordaré el martes a las 15:00 « Llamar al médico ».",
      },
      {
        from: "user",
        text: "Mañana tengo que ir al gimnasio y hacer la compra",
      },
      {
        from: "bot",
        text: "Hecho 👍 He creado 2 tareas:\n🏋️ Sesión de gimnasio — mañana\n🛒 Hacer la compra — mañana",
      },
      { from: "user", text: "He apagado el aire acondicionado" },
      {
        from: "bot",
        text: "¡Bien! 👍 « Apagar el aire acondicionado » está marcada como completada.",
      },
    ],
    steps: {
      title: "Cómo funciona",
      subtitle:
        "Tres pasos, cero fricción. Sin formularios, sin app: solo una conversación.",
      items: [
        {
          title: "Abre el bot",
          description:
            "Inicia una conversación con Telegram Copilot en Telegram con un clic.",
        },
        {
          title: "Escribe con naturalidad",
          description:
            "Dile lo que tienes que hacer, como a un asistente. Sin sintaxis que aprender.",
        },
        {
          title: "Déjalo gestionarlo",
          description:
            "Planifica, te recuerda en el momento justo y mantiene tu lista al día automáticamente.",
        },
      ],
    },
    features: {
      title: "Todo lo que necesitas",
      subtitle:
        "Una verdadera comprensión del lenguaje natural, al servicio de tu organización diaria.",
      items: [
        {
          title: "Lenguaje natural",
          description:
            "Háblale con normalidad, en tu idioma: « Recuérdame llamar al médico el martes a las 15h ». Lo entiende y lo organiza.",
        },
        {
          title: "Recordatorios automáticos",
          description:
            "Recibe una notificación 30 minutos antes de cada tarea programada, directamente en Telegram.",
        },
        {
          title: "Varias tareas a la vez",
          description:
            "« Mañana tengo que ir al gimnasio y hacer la compra » crea todas tus tareas en una sola frase.",
        },
        {
          title: "Mover y completar",
          description:
            "« Mueve la llamada a mañana a las 16h » o « he apagado el aire »: actualiza y marca por ti.",
        },
        {
          title: "Memoria de conversación",
          description:
            "Mantiene el contexto de los últimos mensajes y te pide que precises cuando es ambiguo.",
        },
        {
          title: "Zona horaria",
          description:
            "Define tu zona horaria y todos tus recordatorios sonarán a la hora correcta, estés donde estés.",
        },
      ],
    },
    commands: {
      title: "Para geeks: comandos directos",
      subtitle:
        "¿Prefieres los atajos? Además del lenguaje natural, el bot también entiende comandos directos.",
      items: [
        { command: "/today", description: "Ver todo lo previsto para hoy." },
        { command: "/tomorrow", description: "Ver lo que viene mañana." },
        { command: "/week", description: "Tu agenda de la semana." },
        { command: "/tasks", description: "Listar todas tus tareas abiertas." },
        { command: "/done", description: "Marcar una tarea como completada." },
        { command: "/delete", description: "Eliminar una tarea." },
      ],
      note: "¿Y para crear? Solo escríbelo con normalidad — no hace falta comando.",
    },
    examples: {
      title: "Solo díselo",
      subtitle:
        "Estos son ejemplos de mensajes que Telegram Copilot entiende perfectamente.",
      items: [
        "Recuérdame llamar al médico el martes a las 15h",
        "Mañana tengo que ir al gimnasio y hacer la compra",
        "Mueve la reunión al jueves por la mañana",
        "¿Qué tengo hoy?",
        "He terminado mi entrenamiento",
        "Elimina la reunión de mañana",
      ],
    },
    privacy: {
      title: "Anónimo y privado por diseño",
      subtitle:
        "Tu vida es tuya. Telegram Copilot está pensado para ser discreto.",
      items: [
        {
          title: "Ni teléfono, ni e-mail",
          description:
            "Empiezas directamente desde Telegram. Nunca pedimos una identidad personal para usar el bot.",
        },
        {
          title: "Solo tus tareas",
          description:
            "Solo guardamos lo necesario para tus recordatorios — nada más, sin rastrear tus hábitos.",
        },
        {
          title: "Nunca revendido",
          description:
            "Tus datos nunca se venden ni se comparten con anunciantes. Nunca.",
        },
        {
          title: "Borrable cuando quieras",
          description:
            "Pídelo y tus datos se eliminan. Mantienes el control en todo momento.",
        },
      ],
    },
    affiliation: {
      badge: "Oferta limitada — hasta septiembre",
      title: "Invita amigos, gana el 50%",
      subtitle:
        "Por cada amigo que refieras y se suscriba a Telegram Copilot, ganas el 50% de sus ingresos mensuales — directamente y automáticamente, hasta septiembre.",
      deadline: "Oferta válida hasta septiembre de 2026",
      steps: [
        {
          title: "Obtén tu enlace",
          description:
            "Abre el bot en Telegram, entra en su programa de afiliados y copia tu enlace de referido único.",
        },
        {
          title: "Compártelo",
          description:
            "Comparte tu enlace con amigos, tu comunidad o redes sociales. Sin límite de referidos.",
        },
        {
          title: "Gana el 50%",
          description:
            "Por cada suscripción hecha a través de tu enlace, recibes el 50% de los ingresos cada mes.",
        },
      ],
      cta: "Obtener mi enlace de referido",
    },
    cta: {
      title: "¿Listo para delegar tu organización?",
      subtitle:
        "Abre Telegram Copilot en Telegram y envía tu primer mensaje. Es gratis e inmediato.",
      button: "Abrir en Telegram",
    },
    contact: {
      title: "Contacto y soporte",
      subtitle: "¿Una pregunta, un fallo, una idea? Estamos aquí.",
      description:
        "La forma más rápida de contactarnos es por correo. Cuéntanos qué pasa y te responderemos.",
      emailLabel: "Escríbenos",
      cta: "Enviar un correo",
      responseNote: "Solemos responder en 24–48 horas.",
      back: "Volver al inicio",
    },
    footer: {
      tagline: "Tu copiloto personal en Telegram.",
      features: "Funciones",
      contact: "Contacto",
    },
  },

  it: {
    htmlLang: "it",
    nav: {
      how: "Come funziona",
      features: "Funzionalità",
      examples: "Esempi",
      commands: "Comandi",
      contact: "Contatto",
    },
    openTelegram: "Apri in Telegram",
    hero: {
      badge: "Basato sull'IA",
      titleLead: "Il tuo copilota personale,",
      titleHighlight: "su Telegram",
      subtitle:
        "Telegram Copilot è come un'agenda — ma magica, e che ti parla. Serve solo a questo: scrivi attività, promemoria e appuntamenti con parole normali e ricevi un avviso 30 minuti prima. Nient'altro.",
      ctaPrimary: "Inizia su Telegram",
      ctaSecondary: "Scopri come funziona",
      bullets: [
        "Un'agenda magica che parla",
        "Avviso 30 min prima",
        "Privato e anonimo",
      ],
      online: "online",
    },
    chat: [
      { from: "user", text: "Ricordami di chiamare il medico martedì alle 15" },
      {
        from: "bot",
        text: "Perfetto 👍 Ti ricorderò martedì alle 15:00 di « Chiamare il medico ».",
      },
      { from: "user", text: "Domani devo andare in palestra e fare la spesa" },
      {
        from: "bot",
        text: "Fatto 👍 Ho creato 2 attività:\n🏋️ Sessione in palestra — mattina\n🛒 Fare la spesa — mattina",
      },
      { from: "user", text: "Ho spento il condizionatore" },
      {
        from: "bot",
        text: "Bravo 👍 « Spegnere il condizionatore » è segnata come completata.",
      },
    ],
    steps: {
      title: "Come funziona",
      subtitle:
        "Tre passaggi, zero attrito. Niente moduli, niente app: solo una conversazione.",
      items: [
        {
          title: "Apri il bot",
          description:
            "Avvia una conversazione con Telegram Copilot su Telegram con un clic.",
        },
        {
          title: "Scrivi in modo naturale",
          description:
            "Digli cosa devi fare, come a un assistente. Nessuna sintassi da imparare.",
        },
        {
          title: "Lascia che se ne occupi",
          description:
            "Pianifica, ti ricorda al momento giusto e tiene aggiornata la tua lista automaticamente.",
        },
      ],
    },
    features: {
      title: "Tutto ciò di cui hai bisogno",
      subtitle:
        "Una vera comprensione del linguaggio naturale, al servizio della tua organizzazione quotidiana.",
      items: [
        {
          title: "Linguaggio naturale",
          description:
            "Parlagli normalmente, nella tua lingua: « Ricordami di chiamare il medico martedì alle 15 ». Capisce e organizza.",
        },
        {
          title: "Promemoria automatici",
          description:
            "Ricevi una notifica 30 minuti prima di ogni attività pianificata, direttamente su Telegram.",
        },
        {
          title: "Più attività in una volta",
          description:
            "« Domani devo andare in palestra e fare la spesa » crea tutte le tue attività in una sola frase.",
        },
        {
          title: "Sposta e completa",
          description:
            "« Sposta la chiamata a domani alle 16 » o « ho spento il condizionatore »: aggiorna e spunta per te.",
        },
        {
          title: "Memoria della conversazione",
          description:
            "Mantiene il contesto degli ultimi messaggi e ti chiede di precisare quando è ambiguo.",
        },
        {
          title: "Fuso orario",
          description:
            "Imposta il tuo fuso orario e tutti i promemoria scatteranno all'ora giusta, ovunque tu sia.",
        },
      ],
    },
    commands: {
      title: "Per i geek: comandi diretti",
      subtitle:
        "Preferisci le scorciatoie? Oltre al linguaggio naturale, il bot capisce anche comandi diretti.",
      items: [
        { command: "/today", description: "Vedi tutto ciò che è previsto oggi." },
        { command: "/tomorrow", description: "Vedi cosa arriva domani." },
        { command: "/week", description: "La tua agenda della settimana." },
        { command: "/tasks", description: "Elenca tutte le attività aperte." },
        { command: "/done", description: "Segna un'attività come completata." },
        { command: "/delete", description: "Elimina un'attività." },
      ],
      note: "E per creare? Scrivilo normalmente — nessun comando necessario.",
    },
    examples: {
      title: "Diglielo e basta",
      subtitle:
        "Ecco alcuni esempi di messaggi che Telegram Copilot capisce perfettamente.",
      items: [
        "Ricordami di chiamare il medico martedì alle 15",
        "Domani devo andare in palestra e fare la spesa",
        "Sposta la riunione a giovedì mattina",
        "Cosa ho oggi?",
        "Ho finito il mio allenamento",
        "Elimina la riunione di domani",
      ],
    },
    privacy: {
      title: "Anonimo e privato per progettazione",
      subtitle:
        "La tua vita è tua. Telegram Copilot è pensato per restare discreto.",
      items: [
        {
          title: "Né numero, né e-mail",
          description:
            "Inizi direttamente da Telegram. Non chiediamo mai un'identità personale per usare il bot.",
        },
        {
          title: "Solo le tue attività",
          description:
            "Salviamo solo il necessario per i tuoi promemoria — nulla di più, nessun tracciamento delle abitudini.",
        },
        {
          title: "Mai rivenduto",
          description:
            "I tuoi dati non vengono mai venduti né condivisi con gli inserzionisti. Mai.",
        },
        {
          title: "Cancellabile su richiesta",
          description:
            "Basta chiedere e i tuoi dati vengono cancellati. Il controllo è sempre tuo.",
        },
      ],
    },
    affiliation: {
      badge: "Offerta limitata — fino a settembre",
      title: "Invita amici, guadagna il 50%",
      subtitle:
        "Per ogni amico che referisci e che si iscrive a Telegram Copilot, guadagni il 50% dei suoi ricavi mensili — direttamente e automaticamente, fino a settembre.",
      deadline: "Offerta valida fino a settembre 2026",
      steps: [
        {
          title: "Ottieni il tuo link",
          description:
            "Apri il bot in Telegram, vai al suo programma di affiliazione e copia il tuo link di referral unico.",
        },
        {
          title: "Condividilo",
          description:
            "Condividi il tuo link con amici, la tua community o sui social. Nessun limite di referral.",
        },
        {
          title: "Guadagna il 50%",
          description:
            "Per ogni abbonamento tramite il tuo link, ricevi il 50% dei ricavi ogni mese.",
        },
      ],
      cta: "Ottenere il mio link di referral",
    },
    cta: {
      title: "Pronto a delegare la tua organizzazione?",
      subtitle:
        "Apri Telegram Copilot su Telegram e invia il tuo primo messaggio. È gratis e immediato.",
      button: "Apri in Telegram",
    },
    contact: {
      title: "Contatto e supporto",
      subtitle: "Una domanda, un bug, un'idea? Siamo qui.",
      description:
        "Il modo più rapido per contattarci è via e-mail. Raccontaci cosa succede e ti rispondiamo.",
      emailLabel: "Scrivici",
      cta: "Invia un'e-mail",
      responseNote: "Di solito rispondiamo entro 24–48 ore.",
      back: "Torna alla home",
    },
    footer: {
      tagline: "Il tuo copilota personale su Telegram.",
      features: "Funzionalità",
      contact: "Contatto",
    },
  },

  zh: {
    htmlLang: "zh",
    nav: {
      how: "使用方法",
      features: "功能",
      examples: "示例",
      commands: "命令",
      contact: "联系我们",
    },
    openTelegram: "在 Telegram 中打开",
    hero: {
      badge: "AI 驱动",
      titleLead: "你的个人助理，",
      titleHighlight: "在 Telegram 上",
      subtitle:
        "Telegram Copilot 就像一本日历——但它是魔法的，还会说话。它只做这一件事：用普通话写下任务、提醒和约会，提前 30 分钟收到提醒。仅此而已。",
      ctaPrimary: "在 Telegram 上开始",
      ctaSecondary: "了解使用方法",
      bullets: ["会说话的魔法日历", "提前 30 分钟提醒", "私密且匿名"],
      online: "在线",
    },
    chat: [
      { from: "user", text: "周二下午三点提醒我打电话给医生" },
      {
        from: "bot",
        text: "好的 👍 周二 15:00 我会提醒你「打电话给医生」。",
      },
      { from: "user", text: "明天我需要去健身房和买菜" },
      {
        from: "bot",
        text: "完成 👍 我创建了 2 个任务：\n🏋️ 健身房 — 上午\n🛒 买菜 — 上午",
      },
      { from: "user", text: "我关掉空调了" },
      { from: "bot", text: "很好 👍「关掉空调」已标记为完成。" },
    ],
    steps: {
      title: "使用方法",
      subtitle: "三步完成，零摩擦。无需表单，无需 App，只需对话。",
      items: [
        {
          title: "打开机器人",
          description: "一键在 Telegram 上与 Telegram Copilot 开始对话。",
        },
        {
          title: "自然地写下来",
          description: "像对助理说话一样告诉它你需要做什么，无需学习任何语法。",
        },
        {
          title: "让它来处理",
          description: "它会规划、在正确时间提醒你，并自动保持你的列表最新。",
        },
      ],
    },
    features: {
      title: "你所需要的一切",
      subtitle: "真正的自然语言理解，服务于你的日常组织。",
      items: [
        {
          title: "自然语言",
          description:
            "用你自己的语言自然地说：「周二下午三点提醒我打电话给医生」。它理解并组织。",
        },
        {
          title: "自动提醒",
          description: "在每个计划任务前 30 分钟，直接在 Telegram 中收到通知。",
        },
        {
          title: "一次多个任务",
          description: "「明天我需要去健身房和买菜」一句话就能创建所有任务。",
        },
        {
          title: "移动和完成",
          description: "「把通话移到明天下午四点」或「我关掉空调了」：它会更新并为你勾选。",
        },
        {
          title: "对话记忆",
          description: "它记住最近对话的上下文，在模糊时会请你澄清。",
        },
        {
          title: "时区",
          description: "设置你的时区，无论你在哪里，所有提醒都会在正确时间触发。",
        },
      ],
    },
    commands: {
      title: "极客专区：直接命令",
      subtitle: "喜欢快捷方式？除了自然语言，机器人还支持直接命令。",
      items: [
        { command: "/today", description: "查看今天计划的所有内容。" },
        { command: "/tomorrow", description: "查看明天的安排。" },
        { command: "/week", description: "本周日程。" },
        { command: "/tasks", description: "列出所有未完成任务。" },
        { command: "/done", description: "将任务标记为已完成。" },
        { command: "/delete", description: "删除任务。" },
      ],
      note: "如何创建？直接自然地写下来——不需要任何命令。",
    },
    examples: {
      title: "直接告诉它",
      subtitle: "以下是 Telegram Copilot 能完美理解的消息示例。",
      items: [
        "周二下午三点提醒我打电话给医生",
        "明天我需要去健身房和买菜",
        "把会议改到周四早上",
        "我今天有什么安排？",
        "我锻炼结束了",
        "删除明天的会议",
      ],
    },
    privacy: {
      title: "匿名且私密的设计",
      subtitle: "你的生活属于你。Telegram Copilot 的设计就是为了保持低调。",
      items: [
        {
          title: "无需手机号或邮箱",
          description: "直接从 Telegram 开始。我们从不要求个人身份信息来使用机器人。",
        },
        {
          title: "只有你的任务",
          description: "我们只存储运行提醒所需的内容——仅此而已，不跟踪你的习惯。",
        },
        {
          title: "从不转售",
          description: "你的数据绝不会被出售或与广告商共享。永远不会。",
        },
        {
          title: "可随时删除",
          description: "只需一句话，你的数据就会被清除。你始终掌控一切。",
        },
      ],
    },
    affiliation: {
      badge: "限时优惠——截至九月",
      title: "邀请朋友，赚取 50%",
      subtitle:
        "每推荐一位朋友订阅 Telegram Copilot，你就能获得他们每月收入的 50%——直接、自动地发放，直到九月。",
      deadline: "优惠有效期至 2026 年 9 月",
      steps: [
        {
          title: "获取你的链接",
          description: "在 Telegram 中打开机器人，进入推荐计划，复制你的专属链接。",
        },
        {
          title: "分享它",
          description: "与朋友、社群或社交媒体分享你的链接，推荐数量不限。",
        },
        {
          title: "赚取 50%",
          description: "通过你的链接产生的每份订阅，你每月都能获得 50% 的收入。",
        },
      ],
      cta: "获取我的推荐链接",
    },
    cta: {
      title: "准备好将日程管理委托出去了吗？",
      subtitle: "在 Telegram 上打开 Telegram Copilot 并发送第一条消息。免费且即时。",
      button: "在 Telegram 中打开",
    },
    contact: {
      title: "联系与支持",
      subtitle: "有问题、发现 Bug 或有想法？我们在这里。",
      description: "联系我们最快的方式是发送邮件。告诉我们发生了什么，我们会回复你。",
      emailLabel: "给我们发邮件",
      cta: "发送邮件",
      responseNote: "我们通常在 24–48 小时内回复。",
      back: "返回首页",
    },
    footer: {
      tagline: "你在 Telegram 上的个人助理。",
      features: "功能",
      contact: "联系我们",
    },
  },

  tr: {
    htmlLang: "tr",
    nav: {
      how: "Nasıl çalışır",
      features: "Özellikler",
      examples: "Örnekler",
      commands: "Komutlar",
      contact: "İletişim",
    },
    openTelegram: "Telegram'da Aç",
    hero: {
      badge: "Yapay Zeka ile Çalışır",
      titleLead: "Kişisel kopilotn,",
      titleHighlight: "Telegram'da",
      subtitle:
        "Telegram Copilot bir ajandaya benzer — ama sihirlidir ve seninle konuşur. Tek işlevi budur: görev, hatırlatıcı ve randevularını düz yazıyla gir, 30 dakika öncesinde bildirim al. Başka hiçbir şey yok.",
      ctaPrimary: "Telegram'da Başla",
      ctaSecondary: "Nasıl çalıştığını gör",
      bullets: ["Konuşan sihirli ajanda", "30 dak. önce hatırlatma", "Gizli ve anonim"],
      online: "çevrimiçi",
    },
    chat: [
      { from: "user", text: "Salı saat 15'te doktoru aramayı hatırlat bana" },
      {
        from: "bot",
        text: "Tamam 👍 Salı 15:00'te « Doktoru ara » için seni hatırlatacağım.",
      },
      { from: "user", text: "Yarın spor salonuna gitmem ve alışveriş yapmam lazım" },
      {
        from: "bot",
        text: "Bitti 👍 2 görev oluşturdum:\n🏋️ Spor salonu — sabah\n🛒 Alışveriş — sabah",
      },
      { from: "user", text: "Klimayı kapattım" },
      { from: "bot", text: "Güzel 👍 « Klimayı kapat » tamamlandı olarak işaretlendi." },
    ],
    steps: {
      title: "Nasıl çalışır",
      subtitle: "Üç adım, sıfır sürtüşme. Form yok, uygulama yok: sadece bir sohbet.",
      items: [
        {
          title: "Botu aç",
          description: "Telegram'da Telegram Copilot ile tek tıklamayla sohbet başlat.",
        },
        {
          title: "Doğal yaz",
          description: "Bir asistana söyler gibi yapman gerekenleri söyle. Öğrenilecek sözdizimi yok.",
        },
        {
          title: "Halletmesine izin ver",
          description: "Planlar, doğru zamanda hatırlatır ve listenni otomatik olarak güncel tutar.",
        },
      ],
    },
    features: {
      title: "İhtiyacın olan her şey",
      subtitle: "Günlük organizasyonuna hizmet eden gerçek doğal dil anlayışı.",
      items: [
        {
          title: "Doğal dil",
          description:
            "Kendi dilinle doğal konuş: « Salı saat 15'te doktoru aramayı hatırlat ». Anlar ve düzenler.",
        },
        {
          title: "Otomatik hatırlatmalar",
          description: "Her planlanan görevden 30 dakika önce doğrudan Telegram'da bildirim al.",
        },
        {
          title: "Birden fazla görev",
          description: "« Yarın spor salonuna gitmem ve alışveriş yapmam lazım » tek cümlede tüm görevlerini oluşturur.",
        },
        {
          title: "Taşı ve tamamla",
          description: "« Görüşmeyi yarın saat 16'ya taşı » veya « klimayı kapattım »: günceller ve işaretler.",
        },
        {
          title: "Sohbet hafızası",
          description: "Son mesajların bağlamını hatırlar ve belirsiz olduğunda senden açıklama ister.",
        },
        {
          title: "Saat dilimi",
          description: "Saat dilimini ayarla, nerede olursan ol tüm hatırlatmaların doğru saatte gelsin.",
        },
      ],
    },
    commands: {
      title: "Geekler için: doğrudan komutlar",
      subtitle: "Kısayolları mı tercih ediyorsun? Doğal dilin yanı sıra bot doğrudan komutları da anlar.",
      items: [
        { command: "/today", description: "Bugün için planlanan her şeyi gör." },
        { command: "/tomorrow", description: "Yarın gelecek olanları gör." },
        { command: "/week", description: "Haftanın ajandası." },
        { command: "/tasks", description: "Tüm açık görevleri listele." },
        { command: "/done", description: "Bir görevi tamamlandı olarak işaretle." },
        { command: "/delete", description: "Bir görevi sil." },
      ],
      note: "Peki nasıl oluşturursun? Sadece doğal yaz — komut gerekmez.",
    },
    examples: {
      title: "Sadece söyle",
      subtitle: "Telegram Copilot'un mükemmel anladığı mesaj örnekleri.",
      items: [
        "Salı saat 15'te doktoru aramayı hatırlat bana",
        "Yarın spor salonuna gitmem ve alışveriş yapmam lazım",
        "Toplantıyı Perşembe sabahına taşı",
        "Bugün ne var?",
        "Antrenmanımı bitirdim",
        "Yarınki toplantıyı sil",
      ],
    },
    privacy: {
      title: "Tasarım gereği anonim ve gizli",
      subtitle: "Hayatın sana ait. Telegram Copilot sessiz kalmak için tasarlandı.",
      items: [
        {
          title: "Telefon numarası ya da e-posta yok",
          description: "Doğrudan Telegram'dan başlarsın. Botu kullanmak için hiçbir zaman kişisel kimlik istemeyiz.",
        },
        {
          title: "Sadece görevlerin",
          description: "Yalnızca hatırlatmaların için gereken bilgileri saklarız — fazlasını değil, alışkanlıklarını takip etmeyiz.",
        },
        {
          title: "Asla satılmaz",
          description: "Verilerin asla satılmaz ya da reklamcılarla paylaşılmaz. Hiç.",
        },
        {
          title: "İstediğinde silinebilir",
          description: "Bir isteğin yeterli, verilerini sileriz. Kontrolü her zaman sen elinde tutarsın.",
        },
      ],
    },
    affiliation: {
      badge: "Sınırlı teklif — Eylül'e kadar",
      title: "Arkadaşını davet et, %50 kazan",
      subtitle:
        "Davet ettiğin her arkadaş Telegram Copilot'a abone olduğunda, aylık gelirlerinin %50'sini doğrudan ve otomatik olarak Eylül'e kadar kazanırsın.",
      deadline: "Teklif Eylül 2026'ya kadar geçerli",
      steps: [
        {
          title: "Bağlantını al",
          description: "Telegram'da botu aç, Ortaklık Programı'na git ve benzersiz referans bağlantını kopyala.",
        },
        {
          title: "Paylaş",
          description: "Bağlantını arkadaşlarınla, topluluğunla veya sosyal medyanda paylaş. Sınırsız davet.",
        },
        {
          title: "%50 kazan",
          description: "Bağlantın üzerinden alınan her abonelik için her ay gelirin %50'sini alırsın.",
        },
      ],
      cta: "Referans bağlantımı al",
    },
    cta: {
      title: "Organizasyonunu devretmeye hazır mısın?",
      subtitle: "Telegram'da Telegram Copilot'u aç ve ilk mesajını gönder. Ücretsiz ve anında.",
      button: "Telegram'da Aç",
    },
    contact: {
      title: "İletişim ve destek",
      subtitle: "Bir soru, hata veya fikir mi var? Buradayız.",
      description: "Bize ulaşmanın en hızlı yolu e-posta göndermek. Durumu anlat, sana geri dönelim.",
      emailLabel: "Bize yaz",
      cta: "E-posta gönder",
      responseNote: "Genellikle 24–48 saat içinde yanıt veririz.",
      back: "Ana sayfaya dön",
    },
    footer: {
      tagline: "Telegram'daki kişisel kopilotn.",
      features: "Özellikler",
      contact: "İletişim",
    },
  },
};

export function resolveLanguage(input: string | undefined | null): Language {
  if (!input) return DEFAULT_LANGUAGE;
  const base = input.toLowerCase().split("-")[0];
  const match = LANGUAGES.find((l) => l.code === base);
  return match ? match.code : DEFAULT_LANGUAGE;
}
