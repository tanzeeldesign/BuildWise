import type { ReactNode } from "react";
import gridImage from "@/assets/architectural-grid.png";

type PhoneShellProps = {
  children: ReactNode;
  footer?: ReactNode;
  /** When false, the content pane cannot scroll. Defaults to true. */
  scrollable?: boolean;
  /** Fixed architectural grid behind tab page content (does not scroll). */
  gridBackground?: boolean;
};

export function PhoneShell({
  children,
  footer,
  scrollable = true,
  gridBackground = false,
}: PhoneShellProps) {
  return (
    <div className="flex h-dvh items-stretch justify-center overflow-hidden bg-background md:items-center md:bg-[#E8E4DC] md:p-8">
      <div className="relative flex h-dvh w-full max-w-[430px] flex-col overflow-hidden bg-background md:h-[min(844px,calc(100dvh-4rem))] md:rounded-[2.25rem] md:border md:border-black/5 md:shadow-[0_24px_80px_-20px_rgba(42,38,32,0.35)]">
        {/* Native status-bar safe area */}
        <div
          aria-hidden
          className="shrink-0 pt-[env(safe-area-inset-top)]"
        />
        <div className="relative flex min-h-0 flex-1 flex-col">
          {gridBackground && (
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 z-0 opacity-80"
            >
              <img
                src={gridImage}
                alt=""
                className="h-full w-full object-cover object-top"
                draggable={false}
              />
            </div>
          )}
          <div
            data-phone-scroll
            className={
              scrollable
                ? "relative z-10 flex min-h-0 min-w-0 w-full flex-1 flex-col overflow-y-auto overflow-x-hidden overscroll-y-contain overscroll-x-none bg-transparent"
                : "relative z-10 flex min-h-0 min-w-0 w-full flex-1 flex-col overflow-hidden overscroll-none bg-transparent"
            }
          >
            {children}
          </div>
        </div>
        {footer}
      </div>
    </div>
  );
}
