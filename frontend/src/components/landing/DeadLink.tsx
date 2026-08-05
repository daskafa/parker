"use client";

import type { AnchorHTMLAttributes, MouseEvent, ReactNode } from "react";

type DeadLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  children: ReactNode;
};

/** Landing'deki demo/placeholder linkler — tiklaninca sayfa kaymaz, islem yapmaz. */
export function DeadLink({ children, onClick, ...props }: DeadLinkProps) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    onClick?.(event);
  };

  return (
    <a href="#" role="link" aria-disabled="true" {...props} onClick={handleClick}>
      {children}
    </a>
  );
}
