"use client";

import Link from "next/link";
import { ArrowLeft, Mail, Send, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/components/language-provider";
import { siteConfig } from "@/lib/site";

export default function ContactPage() {
  const { t } = useLanguage();

  return (
    <section className="relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-60 [mask-image:radial-gradient(60%_50%_at_50%_0%,black,transparent)]"
        aria-hidden
      >
        <div className="absolute left-1/2 top-0 h-[420px] w-[820px] -translate-x-1/2 rounded-full bg-primary/20 blur-3xl" />
      </div>

      <div className="container py-20 md:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
            <Mail className="h-6 w-6" />
          </span>
          <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl">
            {t.contact.title}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            {t.contact.subtitle}
          </p>
        </div>

        <Card className="mx-auto mt-12 max-w-lg shadow-xl">
          <CardContent className="flex flex-col items-center gap-6 py-10 text-center">
            <p className="max-w-md text-muted-foreground">
              {t.contact.description}
            </p>

            <div className="w-full rounded-xl border bg-muted/40 px-4 py-4">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {t.contact.emailLabel}
              </p>
              <a
                href={`mailto:${siteConfig.supportEmail}`}
                className="mt-1 block break-all text-lg font-semibold text-primary transition-colors hover:text-primary/80"
              >
                {siteConfig.supportEmail}
              </a>
            </div>

            <Button asChild size="lg" className="w-full sm:w-auto">
              <a href={`mailto:${siteConfig.supportEmail}`}>
                <Send className="h-4 w-4" /> {t.contact.cta}
              </a>
            </Button>

            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock className="h-3.5 w-3.5" /> {t.contact.responseNote}
            </p>
          </CardContent>
        </Card>

        <div className="mt-10 text-center">
          <Button asChild variant="ghost">
            <Link href="/">
              <ArrowLeft className="h-4 w-4" /> {t.contact.back}
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
