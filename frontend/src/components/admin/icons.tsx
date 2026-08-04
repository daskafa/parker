type IconProps = {
  className?: string;
};

export function EyeIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} className={className} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12s3.75-6.75 9.75-6.75S21.75 12 21.75 12s-3.75 6.75-9.75 6.75S2.25 12 2.25 12Z" />
      <circle cx="12" cy="12" r="2.75" />
    </svg>
  );
}

export function SendIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} className={className} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12 20.25 3.75 16.5 20.25 12 13.5 3.75 12Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 13.5 20.25 3.75" />
    </svg>
  );
}

export function TrashIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} className={className} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 7.5h15" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 7.5V5.25h4.5V7.5" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 7.5l.75 12h9l.75-12" />
    </svg>
  );
}

export function PencilIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} className={className} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="m16.5 3.75 3.75 3.75L8.25 19.5H4.5v-3.75L16.5 3.75Z" />
    </svg>
  );
}

export function BellIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} className={className} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3.75a5.25 5.25 0 0 1 5.25 5.25v3.3l1.5 2.7H5.25l1.5-2.7v-3.3A5.25 5.25 0 0 1 12 3.75Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 18.75a2.25 2.25 0 0 0 4.5 0" />
    </svg>
  );
}
