import type { SVGProps } from 'react';

export function PagePulseIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20.5 16.5A7.5 7.5 0 0 0 12 9.5a7.5 7.5 0 0 0-8.5 7" />
      <path d="M4 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
      <path d="m21.5 8.5-1.1-1.1" />
      <path d="m17 1-1 1" />
      <path d="m11 4 1-1" />
      <path d="M3.5 16.5 3 22l5.5-1" />
      <path d="m9.5 9.5 4-4" />
    </svg>
  );
}
