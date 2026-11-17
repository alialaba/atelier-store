import Image from "next/image";

import { ButtonLink, Heading, Media, Text } from "@/components/ui";
import type { Campaign } from "@/lib/content";

/** Half image, half copy panel. Stacks image-first on mobile. */
export function EditorialSplit({ story }: { story: Campaign }) {
  const [primary, ...secondary] = story.actions;

  return (
    <section className="container-bleed grid bg-surface md:grid-cols-2">
      <Media ratio="portrait" className="md:aspect-auto md:min-h-[36rem]">
        <Image
          src={story.image.src}
          alt={story.image.alt}
          fill
          sizes="(min-width: 768px) 50vw, 100vw"
        />
      </Media>
      <div className="gutter-x flex flex-col items-start justify-center gap-5 py-14 md:py-20 lg:px-20">
        <Text variant="label" tone="muted">
          {story.eyebrow}
        </Text>
        <Heading level={2} variant="h1">
          {story.title}
        </Heading>
        {story.body && (
          <Text tone="muted" className="max-w-md">
            {story.body}
          </Text>
        )}
        <div className="mt-3 flex flex-wrap items-center gap-6">
          {primary && (
            <ButtonLink href={primary.href} variant="primary">
              {primary.label}
            </ButtonLink>
          )}
          {secondary.map((action) => (
            <ButtonLink key={action.href} href={action.href} variant="text">
              {action.label}
            </ButtonLink>
          ))}
        </div>
      </div>
    </section>
  );
}
