import { ButtonLink, Container, Heading, Text } from "@/components/ui";

export default function NotFound() {
  return (
    <main id="main" className="flex flex-1 items-center pt-header">
      <Container size="prose" className="section-y flex flex-col items-center gap-4 text-center">
        <Text variant="label" tone="muted">
          404
        </Text>
        <Heading level={1}>Page not found</Heading>
        <Text tone="muted">
          This page isn&apos;t available yet. Explore the latest arrivals instead.
        </Text>
        <ButtonLink href="/" className="mt-4">
          Back to home
        </ButtonLink>
      </Container>
    </main>
  );
}
