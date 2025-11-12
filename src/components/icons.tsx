import type { SVGProps } from 'react';

export const Icons = {
  logo: (props: SVGProps<SVGSVGElement>) => (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8 4V6.25C8 7.35457 7.10457 8.25 6 8.25C4.89543 8.25 4 7.35457 4 6.25V4H3C2.44772 4 2 4.44772 2 5V20C2 20.5523 2.44772 21 3 21H21C21.5523 21 22 20.5523 22 20V5C22 4.44772 21.5523 4 21 4H8Z"
        fill="currentColor"
        fillOpacity="0.3"
      />
      <path
        d="M7 2C8.65685 2 10 3.34315 10 5V8.25C10 9.90685 8.65685 11.25 7 11.25C5.34315 11.25 4 9.90685 4 8.25V5C4 3.34315 5.34315 2 7 2Z"
        fill="currentColor"
      />
       <path
        d="M17 2C18.6569 2 20 3.34315 20 5V8.25C20 9.90685 18.6569 11.25 17 11.25C15.3431 11.25 14 9.90685 14 8.25V5C14 3.34315 15.3431 2 17 2Z"
        fill="currentColor"
      />
    </svg>
  ),
};
