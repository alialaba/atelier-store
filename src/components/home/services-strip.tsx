import { Container, Heading, Section, Text } from "@/components/ui";

type Service = { title: string; body: string };

export function ServicesStrip({ services }: { services: Service[] }) {
  return (
    <Section aria-labelledby="services-heading">
      <Container>
        <Heading id="services-heading" level={2} variant="label" className="mb-8 text-center md:mb-12">
          Atelier services
        </Heading>
        <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0 lg:divide-x lg:divide-line">
          {services.map((service) => (
            <li key={service.title} className="flex flex-col gap-2 text-center lg:px-8">
              <h3 className="type-h3">{service.title}</h3>
              <Text variant="small" tone="muted">
                {service.body}
              </Text>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
