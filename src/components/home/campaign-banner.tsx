import Image from "next/image";

import { ButtonLink, Text } from "@/components/ui";
import type { Campaign } from "@/lib/content";

/** Full-bleed editorial image with centred copy: portrait on mobile, cinematic on desktop. */
export function CampaignBanner({ campaign }: { campaign: Campaign }) {
  return (
    <section className="container-bleed relative isolate flex aspect-[4/5] items-center justify-center overflow-hidden bg-ink text-white md:aspect-[2/1]">
      <Image
        src={campaign.image.src}
        alt={campaign.image.alt}
        fill
        sizes="100vw"
        className="-z-10 object-cover object-[50%_15%]"
      />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-black/25" />
      <div className="gutter-x flex max-w-xl flex-col items-center gap-4 text-center">
        <Text variant="label" tone="inverse">
          {campaign.eyebrow}
        </Text>
        <h2 className="type-display">{campaign.title}</h2>
        {campaign.body && <Text tone="inverse">{campaign.body}</Text>}
        <div className="mt-2 flex gap-3">
          {campaign.actions.map((action) => (
            <ButtonLink key={action.href} href={action.href} variant="inverse">
              {action.label}
            </ButtonLink>
          ))}
        </div>
      </div>
    </section>
  );
}
