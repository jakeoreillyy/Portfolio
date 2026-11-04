// Shape and type shared by both states of the accent button below.
const accentButtonBase =
  "inline-flex items-center gap-1.5 rounded border px-3.5 py-1.5 font-mono text-[13px]";

// Ghost accent button that fills in on hover: the nav contact pill and the
// project card repo links.
export const accentButton =
  `${accentButtonBase} border-accent/40 text-accent transition-colors ` +
  "hover:border-accent hover:bg-accent hover:text-background";

// The hover fill held on, for the nav contact pill while on /contact.
export const accentButtonActive = `${accentButtonBase} border-accent bg-accent text-background`;
