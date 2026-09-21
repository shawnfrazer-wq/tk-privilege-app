import React from 'react';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

type P = { color: string; size?: number; width?: number };
const base = (size: number, color: string, width: number) => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: color,
  strokeWidth: width,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
});

// nav icons, stroke 1.3
export const HomeIcon = ({ color, size = 20 }: P) => (
  <Svg {...base(size, color, 1.3)}>
    <Path d="M4 11l8-7 8 7v9a1 1 0 0 1-1 1h-5v-6h-4v6H5a1 1 0 0 1-1-1z" />
  </Svg>
);
export const CardIcon = ({ color, size = 20 }: P) => (
  <Svg {...base(size, color, 1.3)}>
    <Rect x="3" y="6" width="18" height="12" rx="2" />
    <Path d="M3 10h18" />
  </Svg>
);
export const RewardsIcon = ({ color, size = 20 }: P) => (
  <Svg {...base(size, color, 1.3)}>
    <Path d="M12 3l2.4 5.3 5.6.6-4.2 3.8 1.2 5.6L12 15.6 6.999 18.3l1.2-5.6L4 8.9l5.6-.6z" />
  </Svg>
);
export const VisitsIcon = ({ color, size = 20 }: P) => (
  <Svg {...base(size, color, 1.3)}>
    <Rect x="4" y="5" width="16" height="15" rx="2" />
    <Path d="M4 10h16M8 3v4M16 3v4" />
  </Svg>
);
export const ContactIcon = ({ color, size = 20 }: P) => (
  <Svg {...base(size, color, 1.3)}>
    <Path d="M4 6h16v10H9l-4 4V6z" />
  </Svg>
);

// .top .back, stroke 1.4
export const BackIcon = ({ color, size = 20 }: P) => (
  <Svg {...base(size, color, 1.4)}>
    <Path d="M15 5l-7 7 7 7" />
  </Svg>
);
// .contact .go, stroke 1.4
export const GoIcon = ({ color, size = 16 }: P) => (
  <Svg {...base(size, color, 1.4)}>
    <Path d="M9 5l7 7-7 7" />
  </Svg>
);

// Contact screen, stroke 1.3
export const WhatsAppIcon = ({ color, size = 20 }: P) => (
  <Svg {...base(size, color, 1.3)}>
    <Path d="M4 20l1.3-3.9A8 8 0 1 1 8.4 19.2z" />
    <Path d="M9 10.5c.3 1.6 2 3.3 3.6 3.6l1.2-1.2 1.7.8-.3 1.6c-3 .5-7.2-3.5-6.7-6.5l1.6-.3.8 1.7z" />
  </Svg>
);
export const PhoneIcon = ({ color, size = 20 }: P) => (
  <Svg {...base(size, color, 1.3)}>
    <Path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />
  </Svg>
);
export const MailIcon = ({ color, size = 20 }: P) => (
  <Svg {...base(size, color, 1.3)}>
    <Rect x="3" y="5" width="18" height="14" rx="2" />
    <Path d="M3 7l9 6 9-6" />
  </Svg>
);
export const QuestionIcon = ({ color, size = 20 }: P) => (
  <Svg {...base(size, color, 1.3)}>
    <Circle cx="12" cy="12" r="9" />
    <Path d="M9.5 9.5a2.5 2.5 0 1 1 3 2.4v1.6" />
    <Path d="M12 17h.01" />
  </Svg>
);

// Home rows, stroke 1.3
export const PointsIcon = ({ color, size = 20 }: P) => (
  <Svg {...base(size, color, 1.3)}>
    <Path d="M20 12l-8 8-8-8V4h8z" />
    <Circle cx="15" cy="9" r="1" />
  </Svg>
);
export const ReferIcon = ({ color, size = 20 }: P) => (
  <Svg {...base(size, color, 1.3)}>
    <Circle cx="9" cy="8" r="3" />
    <Path d="M3 20a6 6 0 0 1 12 0" />
    <Circle cx="17" cy="9" r="2.5" />
    <Path d="M21 20a4.5 4.5 0 0 0-6-4.2" />
  </Svg>
);
export const ReviewIcon = ({ color, size = 20 }: P) => (
  <Svg {...base(size, color, 1.3)}>
    <Path d="M4 20l4-1 10-10-3-3L5 16z" />
    <Path d="M13 7l3 3" />
  </Svg>
);
export const DetailsIcon = ({ color, size = 20 }: P) => (
  <Svg {...base(size, color, 1.3)}>
    <Circle cx="12" cy="8" r="4" />
    <Path d="M4 21a8 8 0 0 1 16 0" />
  </Svg>
);
