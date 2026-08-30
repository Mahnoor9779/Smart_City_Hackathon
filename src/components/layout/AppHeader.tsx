/**
 * AppHeader
 *
 * Present on every screen. Its first job is answering the question the old
 * single-screen build never answered: WHERE AM I LOOKING.
 *
 * The place name is the first thing in the header and stays there, so no screen
 * can leave a reader guessing which city these numbers describe. The
 * administrative unit in use is stated next to it, because saying "tehsil"
 * rather than implying union councils is the difference between a map that is
 * honest about its resolution and one that is not.
 */

import Link from "next/link";
import { Icon, type IconName } from "@/components/ui/Icon";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { DISTRICT_NAME, ADMIN_LEVEL_LABEL, AREAS } from "@/lib/geo/lahore";
import styles from "./AppHeader.module.css";

const NAV: readonly { href: string; label: string; icon: IconName }[] = [
  { href: "/", label: "Now", icon: "wind" },
  { href: "/areas", label: "Areas", icon: "map" },
  { href: "/rankings", label: "Rankings", icon: "list" },
];

export function AppHeader() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/" className={styles.brand}>
          <span className={styles.mark} aria-hidden="true">
            <Icon name="layers" size={18} />
          </span>
          <span className={styles.brandText}>
            <span className={styles.place}>{DISTRICT_NAME}</span>
            <span className={styles.context}>
              {AREAS.length} {ADMIN_LEVEL_LABEL}s &middot; live air quality
            </span>
          </span>
        </Link>

        <nav className={styles.nav} aria-label="Main">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className={styles.navLink}>
              <Icon name={item.icon} size={18} />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className={styles.actions}>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
