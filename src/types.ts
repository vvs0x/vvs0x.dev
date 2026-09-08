export interface EntryImage {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface EntryLink {
  label: string;
  href: string;
}

/**
 * Shared shape of everything that appears as a card.
 * Entries with a `body` get a detail page; entries without one are
 * placeholders: their cards are not clickable and show "Coming soon".
 */
export interface Entry {
  /** URL slug, e.g. "automated-ledger-pipeline". */
  id: string;
  title: string;
  /** Plain label without the "//" prefix; the prefix is added in CSS. */
  category: string;
  /** ISO date (YYYY-MM-DD). Leave out for placeholders. */
  date?: string;
  /** Fallback swatch colour when there is no image. */
  color?: string;
  image?: EntryImage;
  /** Paragraphs for the detail page. */
  body?: string[];
  /** External links shown at the end of the detail page. */
  links?: EntryLink[];
}

export type Project = Entry;

export interface PlaygroundItem extends Entry {
  type: 'experiment' | 'thought';
  excerpt?: string;
  /** How many grid columns the card spans on desktop. */
  colSpan?: 1 | 2 | 3;
}
