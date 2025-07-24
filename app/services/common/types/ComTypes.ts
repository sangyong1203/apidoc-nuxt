export type Union<T> = T[keyof T]

export const SIZE = {
  XS: 'xs',
  SM: 'sm',
  MD: 'md',
  LG: 'lg',
  XL: 'xl',
} as const
export type Size = Union<typeof SIZE>

export const IMAGE_RATIO = {
  일대일: '1',
  십육대구: '16/9',
  사대삼: '4/3',
} as const
export type ImageRatio = Union<typeof IMAGE_RATIO>

export const COLOR_TYPE = {
  RED:'#f96060',
  ORANGE: '#f19c4d',
  BLUE: '#4ca5d7',
  GREEN: '#56ba64',
  TEAL: '#009a93',
  YELLOW: '#fbbc05',
  PURPLE: '#68127a',
  NAVY: '#0e306d',
  GRAY: '#c9cbcf',
} as const

export const CHART_COLOR = {
  RED:'#f96060',
  ORANGE: '#f19c4d',
  BLUE: '#4ca5d7',
  GREEN: '#56ba64',
  TEAL: '#009a93',
  YELLOW: '#fbbc05',
  PURPLE: '#68127a',
  NAVY: '#0e306d',
  GRAY: '#c9cbcf',
} as const
export type ChartColor = Union<typeof CHART_COLOR>





