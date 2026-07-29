// A faux Windows title bar for the code-editor cards.
// The minimise / restore / close controls are decorative, for show only.

const btn = "flex w-[42px] items-center justify-center self-stretch text-faint transition-colors";

export function WindowBar({ filename }: { filename: string }) {
  return (
    <div className="flex items-stretch justify-between border-b border-line bg-white/[0.02]">
      <div className="flex items-center gap-2 px-4 py-2.5">
        <img src="/favicon.png" alt="" aria-hidden className="h-[18px] w-[18px] object-contain" />
        <span className="font-mono text-xs text-muted">{filename}</span>
      </div>

      <div className="flex items-stretch" aria-hidden>
        <span className={`${btn} hover:bg-white/[0.06] hover:text-foreground`}>
          <svg width="11" height="11" viewBox="0 0 10 10" stroke="currentColor" strokeWidth="1">
            <line x1="1" y1="5" x2="9" y2="5" />
          </svg>
        </span>
        <span className={`${btn} hover:bg-white/[0.06] hover:text-foreground`}>
          <svg width="11" height="11" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1">
            <path d="M3 3V1h6v6H7" />
            <rect x="1" y="3" width="6" height="6" />
          </svg>
        </span>
        <span className={`${btn} hover:bg-[#e81123] hover:text-white`}>
          <svg width="11" height="11" viewBox="0 0 10 10" stroke="currentColor" strokeWidth="1" strokeLinecap="round">
            <line x1="1.5" y1="1.5" x2="8.5" y2="8.5" />
            <line x1="8.5" y1="1.5" x2="1.5" y2="8.5" />
          </svg>
        </span>
      </div>
    </div>
  );
}
