// Colours, fonts and spacing from the :root block of wireframes/all-screens.html,
// with the greys darkened and Poppins 300 replaced by 400 after testing on the phone (21 September).
export const C = {
  ink: '#141413',
  paper: '#FFFFFF',
  grey: '#3E3A36',
  mute: '#6E6A64',
  band: '#F6F4F1',
  hair: '#E8E5E0',
  hairSoft: '#F1EEEA',
  gold: '#A98351',
  navOff: '#A8A49F',
  placeholder: '#AEAAA5',
  switchOff: '#DDD9D4',
  dark: '#0A0A0A',
};

export const F = {
  serif: 'PlayfairDisplay_400Regular',
  serifMed: 'PlayfairDisplay_500Medium',
  reg: 'Poppins_400Regular',
  med: 'Poppins_500Medium',
  semi: 'Poppins_600SemiBold',
};

export const PAD = 26;
export const GAP = { s: 14, m: 26, l: 34 };

// letter-spacing in the wireframe is given in em; RN wants points
export const ls = (em: number, size: number) => Math.round(em * size * 100) / 100;
