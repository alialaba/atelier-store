"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { BagIcon, CloseIcon, MenuIcon, SearchIcon, UserIcon } from "@/components/icons";
import { useBag } from "@/lib/bag";
import { primaryNav } from "@/lib/navigation";
import { cn } from "@/lib/cn";

/**
 * Fixed header. On the homepage it sits transparent over the hero and turns
 * solid once the page scrolls; everywhere else it is always solid, so those
 * pages need `pt-header` on their first section.
 */
export function SiteHeader() {
  const pathname = usePathname();
  const overHero = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { count: bagCount } = useBag();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
  }, [menuOpen]);

  const transparent = overHero && !scrolled && !menuOpen;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 transition-colors",
        transparent
          ? "bg-transparent text-white"
          : "border-b border-line bg-canvas text-ink",
      )}
    >
      <div className="gutter-x h-header grid grid-cols-[1fr_auto_1fr] items-center gap-4">
        <div className="flex items-center">
          <button
            type="button"
            className="btn-icon -ml-2.5 inline-flex items-center justify-center lg:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex gap-6 type-label">
              {primaryNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="link-reveal"
                    aria-current={pathname === item.href ? "page" : undefined}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <Link
          href="/"
          className="text-lg font-medium uppercase tracking-[0.3em] lg:text-xl"
          aria-label="Atelier, home"
        >
          Atelier
        </Link>

        <ul className="-mr-2.5 flex items-center justify-end">
          <li className="hidden sm:block">
            <Link href="/search" className="btn-icon inline-flex items-center justify-center" aria-label="Search">
              <SearchIcon />
            </Link>
          </li>
          <li>
            <Link href="/account" className="btn-icon inline-flex items-center justify-center" aria-label="Account">
              <UserIcon />
            </Link>
          </li>
          <li>
            <Link
              href="/bag"
              className="btn-icon relative inline-flex items-center justify-center"
              aria-label={`Shopping bag, ${bagCount} ${bagCount === 1 ? "item" : "items"}`}
            >
              <BagIcon />
              {bagCount > 0 && (
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute top-1.5 right-1 flex min-w-4 items-center justify-center rounded-full px-1 text-2xs leading-4 font-bold",
                    transparent ? "bg-white text-ink" : "bg-ink text-white",
                  )}
                >
                  {bagCount}
                </span>
              )}
            </Link>
          </li>
        </ul>
      </div>

      <div
        id="mobile-menu"
        hidden={!menuOpen}
        className="fixed inset-x-0 top-(--header-height) bottom-0 overflow-y-auto bg-canvas text-ink lg:hidden"
      >
        <nav aria-label="Mobile" className="gutter-x py-8">
          <ul className="flex flex-col">
            {primaryNav.map((item) => (
              <li key={item.href} className="border-b border-line">
                <Link
                  href={item.href}
                  className="block py-4 type-h2"
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <ul className="mt-8 flex flex-col gap-4 type-body-sm text-ink-muted">
            <li>
              <Link href="/search" className="link-reveal" onClick={() => setMenuOpen(false)}>
                Search
              </Link>
            </li>
            <li>
              <Link href="/account" className="link-reveal" onClick={() => setMenuOpen(false)}>
                Sign in
              </Link>
            </li>
            <li>
              <Link href="/contact" className="link-reveal" onClick={() => setMenuOpen(false)}>
                Contact us
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
