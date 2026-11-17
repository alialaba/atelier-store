import { Container, Heading, Text, TextLink } from "@/components/ui";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  link?: { label: string; href: string };
};

export function SectionHeading({ eyebrow, title, link }: SectionHeadingProps) {
  return (
    <Container className="mb-8 flex items-end justify-between gap-6 md:mb-10">
      <div className="flex flex-col gap-2">
        {eyebrow && (
          <Text variant="label" tone="muted">
            {eyebrow}
          </Text>
        )}
        <Heading level={2}>{title}</Heading>
      </div>
      {link && (
        <TextLink href={link.href} className="type-label shrink-0">
          {link.label}
        </TextLink>
      )}
    </Container>
  );
}
