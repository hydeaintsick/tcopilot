"use client";

import {
  Send,
  MessageSquareText,
  BellRing,
  ListChecks,
  CalendarClock,
  Sparkles,
  Globe,
  CheckCircle2,
  Link2,
  Share2,
  Coins,
  Clock,
  Terminal,
  ShieldCheck,
  Lock,
  EyeOff,
  Trash2,
  Database,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/components/language-provider";
import { siteConfig } from "@/lib/site";

const featureIcons = [
  MessageSquareText,
  BellRing,
  ListChecks,
  CalendarClock,
  Sparkles,
  Globe,
];

export default function HomePage() {
  const { t } = useLanguage();

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
              <Sparkles className="mr-1 h-3 w-3" /> {t.hero.badge}
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              {t.hero.titleLead}{" "}
              <span className="text-primary">{t.hero.titleHighlight}</span>.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground">
              {t.hero.subtitle}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <a
                  href={siteConfig.telegramUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Send className="h-4 w-4" /> {t.hero.ctaPrimary}
                </a>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href="#fonctionnement">{t.hero.ctaSecondary}</a>
              </Button>
            </div>
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
              {t.hero.bullets.map((item) => (
                <li key={item} className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-primary" /> {item}
                </li>
              ))}
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
                  <p className="text-xs text-muted-foreground">
                    {t.hero.online}
                  </p>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 py-5">
                {t.chat.map((msg, i) => (
                  <div
                    key={i}
                    className={
                      msg.from === "user"
                        ? "flex justify-end"
                        : "flex justify-start"
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
              {t.steps.title}
            </h2>
            <p className="mt-4 text-muted-foreground">{t.steps.subtitle}</p>
          </div>
          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {t.steps.items.map((step, i) => (
              <div key={step.title} className="relative text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-semibold text-primary-foreground">
                  {i + 1}
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
              {t.features.title}
            </h2>
            <p className="mt-4 text-muted-foreground">{t.features.subtitle}</p>
          </div>
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {t.features.items.map((feature, i) => {
              const Icon = featureIcons[i] ?? Sparkles;
              return (
                <Card
                  key={feature.title}
                  className="transition-shadow hover:shadow-md"
                >
                  <CardHeader>
                    <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                      <Icon className="h-5 w-5" />
                    </span>
                    <CardTitle className="pt-3 text-lg">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Commandes (geeks) */}
      <section id="commandes" className="border-t border-border/60 py-20">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <Badge variant="accent" className="mb-4">
              <Terminal className="mr-1 h-3 w-3" /> {t.nav.commands}
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {t.commands.title}
            </h2>
            <p className="mt-4 text-muted-foreground">{t.commands.subtitle}</p>
          </div>
          <div className="mx-auto mt-12 grid max-w-3xl gap-3 sm:grid-cols-2">
            {t.commands.items.map((item) => (
              <div
                key={item.command}
                className="flex items-start gap-3 rounded-xl border bg-card px-4 py-3"
              >
                <code className="mt-0.5 shrink-0 rounded-md bg-muted px-2 py-1 font-mono text-sm font-semibold text-primary">
                  {item.command}
                </code>
                <span className="text-sm text-muted-foreground">
                  {item.description}
                </span>
              </div>
            ))}
          </div>
          <p className="mx-auto mt-6 max-w-3xl text-center text-sm text-muted-foreground">
            {t.commands.note}
          </p>
        </div>
      </section>

      {/* Exemples */}
      <section id="exemples" className="border-t border-border/60 py-20">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {t.examples.title}
            </h2>
            <p className="mt-4 text-muted-foreground">{t.examples.subtitle}</p>
          </div>
          <div className="mx-auto mt-12 grid max-w-3xl gap-3 sm:grid-cols-2">
            {t.examples.items.map((msg) => (
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

      {/* Confidentialité / anonymat */}
      <section id="confidentialite" className="border-t border-border/60 py-20">
        <div className="container">
          <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
            <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {t.privacy.title}
            </h2>
            <p className="mt-4 text-muted-foreground">{t.privacy.subtitle}</p>
          </div>
          <div className="mx-auto mt-12 grid max-w-4xl gap-6 sm:grid-cols-2">
            {t.privacy.items.map((item, i) => {
              const PrivacyIcons = [EyeOff, Database, Lock, Trash2];
              const Icon = PrivacyIcons[i] ?? ShieldCheck;
              return (
                <Card key={item.title} className="h-full">
                  <CardHeader className="flex-row items-start gap-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div>
                      <CardTitle className="text-lg">{item.title}</CardTitle>
                      <p className="mt-2 text-sm text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Affiliation */}
      <section id="affiliation" className="border-t border-border/60 py-20">
        <div className="container">
          <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-accent/5 to-background px-6 py-14 sm:px-12">
            <div
              className="pointer-events-none absolute inset-0 -z-10 opacity-40 [mask-image:radial-gradient(60%_60%_at_70%_20%,black,transparent)]"
              aria-hidden
            >
              <div className="absolute right-0 top-0 h-[360px] w-[560px] rounded-full bg-primary/30 blur-3xl" />
            </div>

            <div className="mx-auto max-w-2xl text-center">
              <Badge variant="accent" className="mb-4">
                <Clock className="mr-1 h-3 w-3" />{" "}
                {t.affiliation.badge}
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                {t.affiliation.title}
              </h2>
              <p className="mt-4 text-muted-foreground">
                {t.affiliation.subtitle}
              </p>
            </div>

            <div className="mx-auto mt-12 grid max-w-3xl gap-8 md:grid-cols-3">
              {t.affiliation.steps.map((step, i) => {
                const AffIcons = [Link2, Share2, Coins];
                const Icon = AffIcons[i] ?? Sparkles;
                return (
                  <div
                    key={step.title}
                    className="flex flex-col items-center text-center"
                  >
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <Icon className="h-5 w-5" />
                    </span>
                    <h3 className="mt-4 text-base font-semibold">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="mt-10 flex flex-col items-center gap-3">
              <Button asChild size="lg">
                <a
                  href={siteConfig.telegramUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Send className="h-4 w-4" /> {t.affiliation.cta}
                </a>
              </Button>
              <p className="text-xs text-muted-foreground">
                {t.affiliation.deadline}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border/60 py-20">
        <div className="container">
          <Card className="overflow-hidden border-primary/30 bg-primary/5">
            <CardContent className="flex flex-col items-center gap-6 py-14 text-center">
              <h2 className="max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">
                {t.cta.title}
              </h2>
              <p className="max-w-xl text-muted-foreground">{t.cta.subtitle}</p>
              <Button asChild size="lg">
                <a
                  href={siteConfig.telegramUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Send className="h-4 w-4" /> {t.cta.button}
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
}
