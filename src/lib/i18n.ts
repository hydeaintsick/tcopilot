export const LANGUAGES = [
  { code: "en", label: "EN" },
  { code: "fr", label: "FR" },
  { code: "ru", label: "RU" },
  { code: "cs", label: "CZ" },
  { code: "es", label: "ES" },
  { code: "it", label: "IT" },
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

export interface Dictionary {
  htmlLang: string;
  nav: { how: string; features: string; examples: string };
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
  examples: { title: string; subtitle: string; items: string[] };
  affiliation: {
    badge: string;
    title: string;
    subtitle: string;
    deadline: string;
    steps: TitledItem[];
    cta: string;
  };
  cta: { title: string; subtitle: string; button: string };
  footer: { tagline: string; features: string };
}

export const translations: Record<Language, Dictionary> = {
  en: {
    htmlLang: "en",
    nav: { how: "How it works", features: "Features", examples: "Examples" },
    openTelegram: "Open in Telegram",
    hero: {
      badge: "Powered by AI",
      titleLead: "Your personal copilot,",
      titleHighlight: "on Telegram",
      subtitle:
        "TCopilot turns your messages into tasks, reminders and appointments. Write in French, like talking to an assistant: it handles the rest.",
      ctaPrimary: "Start on Telegram",
      ctaSecondary: "See how it works",
      bullets: ["100% in French", "Smart reminders", "No app to install"],
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
            "Start a conversation with TCopilot on Telegram in one click.",
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
            "Talk to it normally in French: « Remind me to call the doctor Tuesday at 3pm ». It understands and organizes.",
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
    examples: {
      title: "Just tell it things",
      subtitle: "Here are examples of messages TCopilot understands perfectly.",
      items: [
        "Remind me to call the doctor on Tuesday at 3pm",
        "Tomorrow I need to hit the gym and do groceries",
        "Move the meeting to Thursday morning",
        "What do I have today?",
        "I finished my workout",
        "Delete tomorrow's meeting",
      ],
    },
    affiliation: {
      badge: "Limited offer — until September",
      title: "Invite friends, earn 50%",
      subtitle:
        "For every friend you refer who subscribes to TCopilot, you earn 50% of their monthly revenue — directly and automatically, until September.",
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
        "Open TCopilot on Telegram and send your first message. It's free and instant.",
      button: "Open in Telegram",
    },
    footer: {
      tagline: "Your personal copilot on Telegram.",
      features: "Features",
    },
  },

  fr: {
    htmlLang: "fr",
    nav: {
      how: "Fonctionnement",
      features: "Fonctionnalités",
      examples: "Exemples",
    },
    openTelegram: "Ouvrir dans Telegram",
    hero: {
      badge: "Propulsé par l'IA",
      titleLead: "Ton copilote personnel,",
      titleHighlight: "sur Telegram",
      subtitle:
        "TCopilot transforme tes messages en tâches, rappels et rendez-vous. Écris en français, comme à un assistant : il s'occupe du reste.",
      ctaPrimary: "Démarrer sur Telegram",
      ctaSecondary: "Voir comment ça marche",
      bullets: [
        "100% en français",
        "Rappels intelligents",
        "Aucune app à installer",
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
            "Lance une conversation avec TCopilot sur Telegram en un clic.",
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
            "Parle-lui normalement en français : « Rappelle-moi d'appeler le médecin mardi à 15h ». Il comprend et organise.",
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
    examples: {
      title: "Dis-lui simplement les choses",
      subtitle:
        "Voici des exemples de messages que TCopilot comprend parfaitement.",
      items: [
        "Rappelle-moi d'appeler le médecin mardi à 15h",
        "Demain faut que je fasse la salle et les courses",
        "Déplace la réunion à jeudi matin",
        "Qu'est-ce que j'ai aujourd'hui ?",
        "J'ai terminé ma séance",
        "Supprime la réunion de demain",
      ],
    },
    affiliation: {
      badge: "Offre limitée — jusqu'en septembre",
      title: "Invite tes amis, gagne 50%",
      subtitle:
        "Pour chaque ami que tu parraines et qui s'abonne à TCopilot, tu gagnes 50% de ses revenus mensuels — directement et automatiquement, jusqu'en septembre.",
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
        "Ouvre TCopilot sur Telegram et envoie ton premier message. C'est gratuit et immédiat.",
      button: "Ouvrir dans Telegram",
    },
    footer: {
      tagline: "Ton copilote personnel sur Telegram.",
      features: "Fonctionnalités",
    },
  },

  ru: {
    htmlLang: "ru",
    nav: { how: "Как это работает", features: "Возможности", examples: "Примеры" },
    openTelegram: "Открыть в Telegram",
    hero: {
      badge: "На базе ИИ",
      titleLead: "Твой личный помощник,",
      titleHighlight: "в Telegram",
      subtitle:
        "TCopilot превращает твои сообщения в задачи, напоминания и встречи. Пиши на французском, как ассистенту: остальное он сделает сам.",
      ctaPrimary: "Начать в Telegram",
      ctaSecondary: "Узнать, как это работает",
      bullets: [
        "100% на французском",
        "Умные напоминания",
        "Не нужно ставить приложение",
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
          description: "Начни разговор с TCopilot в Telegram в один клик.",
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
            "Говори с ним как обычно на французском: « Напомни позвонить врачу во вторник в 15:00 ». Он понимает и организует.",
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
    examples: {
      title: "Просто скажи ему",
      subtitle:
        "Вот примеры сообщений, которые TCopilot прекрасно понимает.",
      items: [
        "Напомни мне позвонить врачу во вторник в 15:00",
        "Завтра мне нужно в спортзал и за покупками",
        "Перенеси встречу на утро четверга",
        "Что у меня сегодня?",
        "Я закончил тренировку",
        "Удали завтрашнюю встречу",
      ],
    },
    affiliation: {
      badge: "Ограниченное предложение — до сентября",
      title: "Приглашай друзей, зарабатывай 50%",
      subtitle:
        "За каждого друга, которого ты пригласишь и кто оформит подписку на TCopilot, ты получаешь 50% его ежемесячного дохода — напрямую и автоматически, до сентября.",
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
        "Открой TCopilot в Telegram и отправь первое сообщение. Это бесплатно и мгновенно.",
      button: "Открыть в Telegram",
    },
    footer: {
      tagline: "Твой личный помощник в Telegram.",
      features: "Возможности",
    },
  },

  cs: {
    htmlLang: "cs",
    nav: { how: "Jak to funguje", features: "Funkce", examples: "Příklady" },
    openTelegram: "Otevřít v Telegramu",
    hero: {
      badge: "Poháněno AI",
      titleLead: "Tvůj osobní kopilot,",
      titleHighlight: "na Telegramu",
      subtitle:
        "TCopilot promění tvé zprávy v úkoly, připomínky a schůzky. Piš francouzsky, jako asistentovi: o zbytek se postará.",
      ctaPrimary: "Začít na Telegramu",
      ctaSecondary: "Podívat se, jak to funguje",
      bullets: [
        "100% ve francouzštině",
        "Chytré připomínky",
        "Žádná aplikace k instalaci",
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
            "Spusť konverzaci s TCopilot na Telegramu jedním kliknutím.",
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
            "Mluv s ním normálně francouzsky: « Připomeň mi zavolat lékaři v úterý v 15:00 ». Rozumí a zorganizuje.",
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
    examples: {
      title: "Stačí mu to říct",
      subtitle:
        "Zde jsou příklady zpráv, kterým TCopilot dokonale rozumí.",
      items: [
        "Připomeň mi zavolat lékaři v úterý v 15:00",
        "Zítra musím do posilovny a nakoupit",
        "Přesuň schůzku na čtvrteční ráno",
        "Co mám dnes?",
        "Dokončil jsem trénink",
        "Smaž zítřejší schůzku",
      ],
    },
    affiliation: {
      badge: "Omezená nabídka — do září",
      title: "Pozvi přátele, vydělej 50 %",
      subtitle:
        "Za každého přítele, kterého doporučíš a který si předplatí TCopilot, získáš 50 % jeho měsíčních příjmů — přímo a automaticky, do září.",
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
        "Otevři TCopilot na Telegramu a pošli svou první zprávu. Je to zdarma a okamžité.",
      button: "Otevřít v Telegramu",
    },
    footer: {
      tagline: "Tvůj osobní kopilot na Telegramu.",
      features: "Funkce",
    },
  },

  es: {
    htmlLang: "es",
    nav: { how: "Cómo funciona", features: "Funciones", examples: "Ejemplos" },
    openTelegram: "Abrir en Telegram",
    hero: {
      badge: "Impulsado por IA",
      titleLead: "Tu copiloto personal,",
      titleHighlight: "en Telegram",
      subtitle:
        "TCopilot convierte tus mensajes en tareas, recordatorios y citas. Escribe en francés, como a un asistente: él se encarga del resto.",
      ctaPrimary: "Empezar en Telegram",
      ctaSecondary: "Ver cómo funciona",
      bullets: [
        "100% en francés",
        "Recordatorios inteligentes",
        "Sin app que instalar",
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
            "Inicia una conversación con TCopilot en Telegram con un clic.",
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
            "Háblale con normalidad en francés: « Recuérdame llamar al médico el martes a las 15h ». Lo entiende y lo organiza.",
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
    examples: {
      title: "Solo díselo",
      subtitle:
        "Estos son ejemplos de mensajes que TCopilot entiende perfectamente.",
      items: [
        "Recuérdame llamar al médico el martes a las 15h",
        "Mañana tengo que ir al gimnasio y hacer la compra",
        "Mueve la reunión al jueves por la mañana",
        "¿Qué tengo hoy?",
        "He terminado mi entrenamiento",
        "Elimina la reunión de mañana",
      ],
    },
    affiliation: {
      badge: "Oferta limitada — hasta septiembre",
      title: "Invita amigos, gana el 50%",
      subtitle:
        "Por cada amigo que refieras y se suscriba a TCopilot, ganas el 50% de sus ingresos mensuales — directamente y automáticamente, hasta septiembre.",
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
        "Abre TCopilot en Telegram y envía tu primer mensaje. Es gratis e inmediato.",
      button: "Abrir en Telegram",
    },
    footer: {
      tagline: "Tu copiloto personal en Telegram.",
      features: "Funciones",
    },
  },

  it: {
    htmlLang: "it",
    nav: { how: "Come funziona", features: "Funzionalità", examples: "Esempi" },
    openTelegram: "Apri in Telegram",
    hero: {
      badge: "Basato sull'IA",
      titleLead: "Il tuo copilota personale,",
      titleHighlight: "su Telegram",
      subtitle:
        "TCopilot trasforma i tuoi messaggi in attività, promemoria e appuntamenti. Scrivi in francese, come a un assistente: pensa lui al resto.",
      ctaPrimary: "Inizia su Telegram",
      ctaSecondary: "Scopri come funziona",
      bullets: [
        "100% in francese",
        "Promemoria intelligenti",
        "Nessuna app da installare",
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
            "Avvia una conversazione con TCopilot su Telegram con un clic.",
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
            "Parlagli normalmente in francese: « Ricordami di chiamare il medico martedì alle 15 ». Capisce e organizza.",
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
    examples: {
      title: "Diglielo e basta",
      subtitle:
        "Ecco alcuni esempi di messaggi che TCopilot capisce perfettamente.",
      items: [
        "Ricordami di chiamare il medico martedì alle 15",
        "Domani devo andare in palestra e fare la spesa",
        "Sposta la riunione a giovedì mattina",
        "Cosa ho oggi?",
        "Ho finito il mio allenamento",
        "Elimina la riunione di domani",
      ],
    },
    affiliation: {
      badge: "Offerta limitata — fino a settembre",
      title: "Invita amici, guadagna il 50%",
      subtitle:
        "Per ogni amico che referisci e che si iscrive a TCopilot, guadagni il 50% dei suoi ricavi mensili — direttamente e automaticamente, fino a settembre.",
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
        "Apri TCopilot su Telegram e invia il tuo primo messaggio. È gratis e immediato.",
      button: "Apri in Telegram",
    },
    footer: {
      tagline: "Il tuo copilota personale su Telegram.",
      features: "Funzionalità",
    },
  },
};

export function resolveLanguage(input: string | undefined | null): Language {
  if (!input) return DEFAULT_LANGUAGE;
  const base = input.toLowerCase().split("-")[0];
  const match = LANGUAGES.find((l) => l.code === base);
  return match ? match.code : DEFAULT_LANGUAGE;
}
