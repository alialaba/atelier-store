import Image from "next/image";

import { ButtonLink, Container, Text } from "@/components/ui";
import type { Campaign } from "@/lib/content";

/** Full-viewport campaign image that the transparent header sits on. */
export function Hero({ campaign }: { campaign: Campaign }) {
  return (
    <section className="relative isolate flex h-svh min-h-[36rem] items-end overflow-hidden bg-ink text-white">
      <Image
        src={campaign.image.src}
        alt={campaign.image.alt}
        fill
        preload
        sizes="100vw"
        className="-z-10 object-cover object-[50%_30%]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-linear-to-t from-black/60 via-black/10 to-black/30"
      />
      <Container className="flex flex-col items-start gap-5 pb-12 md:pb-20">
        <Text variant="label" tone="inverse">
          {campaign.eyebrow}
        </Text>
        <h1 className="type-display max-w-3xl">{campaign.title}</h1>
        {campaign.body && (
          <Text tone="inverse" className="max-w-md opacity-90">
            {campaign.body}
          </Text>
        )}
        <div className="mt-2 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          {campaign.actions.map((action) => (
            <ButtonLink key={action.href} href={action.href} variant="inverse">
              {action.label}
            </ButtonLink>
          ))}
        </div>
      </Container>
    </section>
  );
}
