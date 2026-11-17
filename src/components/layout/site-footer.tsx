import { Container, Text, TextLink } from "@/components/ui";
import { footerNav } from "@/lib/navigation";

export function SiteFooter() {
  return (
    <footer className="bg-ink text-white">
      <Container className="section-y">
        <div className="grid gap-10 md:grid-cols-[2fr_1fr_1fr_1fr] md:gap-8">
          <div className="flex max-w-sm flex-col gap-3">
            <p className="text-xl font-medium uppercase tracking-[0.3em]">
              Atelier
            </p>
            <Text variant="small" tone="inverse" className="opacity-70">
              Modern wardrobe essentials, made in small runs by independent
              ateliers.
            </Text>
          </div>
          {footerNav.map((group) => (
            <nav key={group.title} aria-label={group.title}>
              <h2 className="type-label">{group.title}</h2>
              <ul className="mt-4 flex flex-col gap-3 type-body-sm opacity-80">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <TextLink variant="nav" href={link.href}>
                      {link.label}
                    </TextLink>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <hr className="mt-12 border-0 border-t border-white/20" />
        <div className="mt-6 flex flex-col gap-2 type-caption opacity-60 sm:flex-row sm:justify-between">
          <p>© Atelier. All rights reserved.</p>
          <p>United States · English · USD</p>
        </div>
      </Container>
    </footer>
  );
}
