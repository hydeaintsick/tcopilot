import {
  Send,
  MessageSquareText,
  BellRing,
  ListChecks,
  CalendarClock,
  Sparkles,
  Globe,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { siteConfig } from "@/lib/site";

const features = [
  {
    icon: MessageSquareText,
    title: "Langage naturel",
    description:
      "Parle-lui normalement en français : « Rappelle-moi d'appeler le médecin mardi à 15h ». Il comprend et organise.",
  },
  {
    icon: BellRing,
    title: "Rappels automatiques",
    description:
      "Reçois une notification 30 minutes avant chaque tâche planifiée, directement dans Telegram.",
  },
  {
    icon: ListChecks,
    title: "Plusieurs tâches d'un coup",
    description:
      "« Demain faut que je fasse la salle et les courses » crée toutes tes tâches en une seule phrase.",
  },
  {
    icon: CalendarClock,
    title: "Déplacer & terminer",
    description:
      "« Déplace l'appel à demain 16h » ou « j'ai éteint la clim » : il met à jour et coche pour toi.",
  },
  {
    icon: Sparkles,
    title: "Mémoire de conversation",
    description:
      "Il garde le contexte des derniers échanges et te demande de préciser quand c'est ambigu.",
  },
  {
    icon: Globe,
    title: "Fuseau horaire",
    description:
      "Définis ton fuseau et tous tes rappels tombent à la bonne heure, où que tu sois.",
  },
];

const steps = [
  {
    number: "1",
    title: "Ouvre le bot",
    description: "Lance une conversation avec TCopilot sur Telegram en un clic.",
  },
  {
    number: "2",
    title: "Écris naturellement",
    description:
      "Dis-lui ce que tu as à faire, comme à un assistant. Pas de syntaxe à apprendre.",
  },
  {
    number: "3",
    title: "Laisse-le gérer",
    description:
      "Il planifie, te rappelle au bon moment et garde ta liste à jour automatiquement.",
  },
];

const chatPreview = [
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
  { from: "bot", text: "Bravo 👍 « Éteindre la clim » est marquée comme terminée." },
];

const exampleMessages = [
  "Rappelle-moi d'appeler le médecin mardi à 15h",
  "Demain faut que je fasse la salle et les courses",
  "Déplace la réunion à jeudi matin",
  "Qu'est-ce que j'ai aujourd'hui ?",
  "J'ai terminé ma séance",
  "Supprime la réunion de demain",
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 -z-10 opacity-60 [mask-image:radial-gradient(60%_50%_at_50%_0%,black,transparent)]"
          aria-hidden
        >
          <div className="absolute left-1/2 top-0 h-[480px] w-[880px] -translate-x-1/2 rounded-full bg-primary/20 blur-3xl" />
        </div>

        <div className="container grid items-center gap-12 py-20 md:py-28 lg:grid-cols-2">
          <div className="animate-fade-up">
            <Badge variant="accent" className="mb-4">
              <Sparkles className="mr-1 h-3 w-3" /> Propulsé par l'IA
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Ton copilote personnel,{" "}
              <span className="text-primary">sur Telegram</span>.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground">
              {siteConfig.name} transforme tes messages en tâches, rappels et
              rendez-vous. Écris en français, comme à un assistant : il
              s'occupe du reste.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <a href={siteConfig.telegramUrl} target="_blank" rel="noreferrer">
                  <Send className="h-4 w-4" /> Démarrer sur Telegram
                </a>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href="#fonctionnement">Voir comment ça marche</a>
              </Button>
            </div>
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
              {["100% en français", "Rappels intelligents", "Aucune app à installer"].map(
                (item) => (
                  <li key={item} className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-primary" /> {item}
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Chat mockup */}
          <div className="animate-fade-up">
            <Card className="mx-auto max-w-md shadow-xl">
              <CardHeader className="flex-row items-center gap-3 border-b">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Send className="h-4 w-4" />
                </span>
                <div>
                  <CardTitle className="text-base">{siteConfig.name}</CardTitle>
                  <p className="text-xs text-muted-foreground">en ligne</p>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 py-5">
                {chatPreview.map((msg, i) => (
                  <div
                    key={i}
                    className={
                      msg.from === "user" ? "flex justify-end" : "flex justify-start"
                    }
                  >
                    <div
                      className={
                        "max-w-[80%] whitespace-pre-line rounded-2xl px-4 py-2 text-sm " +
                        (msg.from === "user"
                          ? "rounded-br-sm bg-primary text-primary-foreground"
                          : "rounded-bl-sm bg-muted text-foreground")
                      }
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Comment ça marche */}
      <section id="fonctionnement" className="border-t border-border/60 py-20">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Comment ça marche
            </h2>
            <p className="mt-4 text-muted-foreground">
              Trois étapes, zéro friction. Pas de formulaire, pas d'app : juste
              une conversation.
            </p>
          </div>
          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {steps.map((step) => (
              <div key={step.number} className="relative text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-semibold text-primary-foreground">
                  {step.number}
                </div>
                <h3 className="mt-5 text-lg font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fonctionnalités */}
      <section id="fonctionnalites" className="border-t border-border/60 py-20">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Tout ce dont tu as besoin
            </h2>
            <p className="mt-4 text-muted-foreground">
              Une vraie compréhension du langage naturel, au service de ton
              organisation quotidienne.
            </p>
          </div>
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <Card key={feature.title} className="transition-shadow hover:shadow-md">
                <CardHeader>
                  <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                    <feature.icon className="h-5 w-5" />
                  </span>
                  <CardTitle className="pt-3 text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Exemples */}
      <section id="exemples" className="border-t border-border/60 py-20">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Dis-lui simplement les choses
            </h2>
            <p className="mt-4 text-muted-foreground">
              Voici des exemples de messages que {siteConfig.name} comprend
              parfaitement.
            </p>
          </div>
          <div className="mx-auto mt-12 grid max-w-3xl gap-3 sm:grid-cols-2">
            {exampleMessages.map((msg) => (
              <div
                key={msg}
                className="flex items-start gap-3 rounded-xl border bg-card px-4 py-3 text-sm"
              >
                <MessageSquareText className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>« {msg} »</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border/60 py-20">
        <div className="container">
          <Card className="overflow-hidden border-primary/30 bg-primary/5">
            <CardContent className="flex flex-col items-center gap-6 py-14 text-center">
              <h2 className="max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">
                Prêt à déléguer ton organisation ?
              </h2>
              <p className="max-w-xl text-muted-foreground">
                Ouvre {siteConfig.name} sur Telegram et envoie ton premier
                message. C'est gratuit et immédiat.
              </p>
              <Button asChild size="lg">
                <a href={siteConfig.telegramUrl} target="_blank" rel="noreferrer">
                  <Send className="h-4 w-4" /> Ouvrir dans Telegram
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
}
