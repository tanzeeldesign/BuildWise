import type { ReactNode } from "react";

type PhoneShellProps = {
  children: ReactNode;
  footer?: ReactNode;
};

export function PhoneShell({ children, footer }: PhoneShellProps) {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-[oklch(0.24_0.02_76)] md:p-6">
      <div className="relative flex h-dvh w-full max-w-[390px] flex-col overflow-hidden bg-background shadow-none md:h-[844px] md:rounded-[2rem] md:border md:border-border md:shadow-2xl">
        <div
          data-phone-scroll
          className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain"
        >
          {children}
        </div>
        {footer}
      </div>
    </div>
  );
}
