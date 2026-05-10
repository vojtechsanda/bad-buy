'use client';
import { vars } from 'nativewind';

export const config = {
  light: vars({
    /* Primary — Sage Teal */
    '--color-primary-0': '245 250 248',
    '--color-primary-50': '240 247 245', // #F0F7F5
    '--color-primary-100': '217 235 229', // #D9EBE5
    '--color-primary-200': '170 206 197',
    '--color-primary-300': '127 184 167', // #7FB8A7
    '--color-primary-400': '94 164 154',
    '--color-primary-500': '62 143 124', // #3E8F7C — brand primary CTA
    '--color-primary-600': '52 122 104',
    '--color-primary-700': '42 101 87', // #2A6557 — pressed primary
    '--color-primary-800': '34 82 69',
    '--color-primary-900': '26 63 54', // #1A3F36 — dark accent
    '--color-primary-950': '16 38 32',

    /* Secondary — Warm Neutral Grays (surfaces & text) */
    '--color-secondary-0': '255 255 255', // white surface
    '--color-secondary-50': '251 249 245', // #FBF9F5 — app background
    '--color-secondary-100': '244 241 235', // #F4F1EB — surface-alt
    '--color-secondary-200': '232 226 214', // #E8E2D6 — borders / dividers
    '--color-secondary-300': '210 204 191',
    '--color-secondary-400': '184 178 168',
    '--color-secondary-500': '154 147 138', // #9A938A — placeholder / disabled text
    '--color-secondary-600': '107 102 96', // #6B6660 — secondary text
    '--color-secondary-700': '74 69 64',
    '--color-secondary-800': '44 42 38', // #2C2A26 — primary body text
    '--color-secondary-900': '30 28 25',
    '--color-secondary-950': '16 15 13',

    /* Tertiary — Accent Coral / Peach */
    '--color-tertiary-0': '255 247 244',
    '--color-tertiary-50': '255 240 232',
    '--color-tertiary-100': '252 233 224', // #FCE9E0 — soft accent background
    '--color-tertiary-200': '247 213 196',
    '--color-tertiary-300': '242 191 162',
    '--color-tertiary-400': '237 168 140',
    '--color-tertiary-500': '232 155 122', // #E89B7A — accent CTA / level badges
    '--color-tertiary-600': '220 136 102',
    '--color-tertiary-700': '201 117 84', // #C97554 — accent pressed
    '--color-tertiary-800': '175 98 68',
    '--color-tertiary-900': '143 79 53',
    '--color-tertiary-950': '111 60 38',

    /* Error — Danger Red */
    '--color-error-0': '255 245 245',
    '--color-error-50': '255 235 235',
    '--color-error-100': '250 210 210',
    '--color-error-200': '240 175 175',
    '--color-error-300': '225 140 140',
    '--color-error-400': '210 115 115',
    '--color-error-500': '196 87 87', // #C45757 — delete / destructive actions
    '--color-error-600': '180 70 70',
    '--color-error-700': '160 55 55',
    '--color-error-800': '135 40 40',
    '--color-error-900': '110 30 30',
    '--color-error-950': '80 20 20',

    /* Success — Teal (same hue as primary) */
    '--color-success-0': '240 250 248',
    '--color-success-50': '210 238 232',
    '--color-success-100': '174 224 215',
    '--color-success-200': '140 210 198',
    '--color-success-300': '106 192 179',
    '--color-success-400': '80 170 156',
    '--color-success-500': '62 143 124', // #3E8F7C = primary-500
    '--color-success-600': '50 122 104',
    '--color-success-700': '42 101 87',
    '--color-success-800': '34 82 69',
    '--color-success-900': '26 63 54',
    '--color-success-950': '16 38 32',

    /* Warning — Amber */
    '--color-warning-0': '255 252 238',
    '--color-warning-50': '255 246 218',
    '--color-warning-100': '254 238 184',
    '--color-warning-200': '250 225 144',
    '--color-warning-300': '245 210 112',
    '--color-warning-400': '237 192 85',
    '--color-warning-500': '229 169 60', // #E5A93C — premium expiry warnings
    '--color-warning-600': '212 144 48',
    '--color-warning-700': '186 121 40',
    '--color-warning-800': '155 98 32',
    '--color-warning-900': '124 76 24',
    '--color-warning-950': '94 56 16',

    /* Info — Steel Blue */
    '--color-info-0': '240 246 252',
    '--color-info-50': '220 234 245',
    '--color-info-100': '195 218 238',
    '--color-info-200': '170 202 231',
    '--color-info-300': '142 184 220',
    '--color-info-400': '117 166 210',
    '--color-info-500': '91 141 184', // #5B8DB8 — info icons / onboarding
    '--color-info-600': '74 120 165',
    '--color-info-700': '59 99 144',
    '--color-info-800': '45 79 120',
    '--color-info-900': '33 60 96',
    '--color-info-950': '22 43 72',

    /* Typography — Warm Dark Text */
    '--color-typography-0': '254 254 254', // text-inverse (on dark/primary fills)
    '--color-typography-50': '245 243 240',
    '--color-typography-100': '225 222 218',
    '--color-typography-200': '200 196 192',
    '--color-typography-300': '175 170 165',
    '--color-typography-400': '154 147 138', // #9A938A — placeholders
    '--color-typography-500': '130 125 120',
    '--color-typography-600': '107 102 96', // #6B6660 — captions / secondary labels
    '--color-typography-700': '80 76 72',
    '--color-typography-800': '60 56 52',
    '--color-typography-900': '44 42 38', // #2C2A26 — primary body text
    '--color-typography-950': '30 28 25',

    /* Outline — Warm Borders */
    '--color-outline-0': '255 255 254',
    '--color-outline-50': '248 246 242',
    '--color-outline-100': '240 237 232',
    '--color-outline-200': '232 226 214', // #E8E2D6 — hairline borders / dividers
    '--color-outline-300': '210 205 198',
    '--color-outline-400': '185 180 174',
    '--color-outline-500': '154 147 138',
    '--color-outline-600': '120 115 110',
    '--color-outline-700': '90 85 80',
    '--color-outline-800': '60 56 52',
    '--color-outline-900': '40 38 35',
    '--color-outline-950': '25 23 21',

    /* Background — Warm Off-White */
    '--color-background-0': '255 255 255', // #FFFFFF — card / surface
    '--color-background-50': '251 249 245', // #FBF9F5 — app background
    '--color-background-100': '244 241 235', // #F4F1EB — surface-alt / nested content
    '--color-background-200': '232 226 214', // #E8E2D6
    '--color-background-300': '215 210 202',
    '--color-background-400': '192 187 180',
    '--color-background-500': '170 165 158',
    '--color-background-600': '140 135 128',
    '--color-background-700': '110 105 98',
    '--color-background-800': '80 76 70',
    '--color-background-900': '50 47 43',
    '--color-background-950': '25 23 21',

    /* Background Semantic */
    '--color-background-error': '255 242 242',
    '--color-background-warning': '255 250 235',
    '--color-background-success': '235 248 245',
    '--color-background-muted': '248 246 242',
    '--color-background-info': '237 244 252',

    /* Focus Ring Indicator */
    '--color-indicator-primary': '62 143 124', // primary-500
    '--color-indicator-info': '91 141 184', // info-500
    '--color-indicator-error': '196 87 87', // error-500
  }),

  // Dark theme — inverted; kept for structural parity (v1 is light-only)
  dark: vars({
    '--color-primary-0': '16 38 32',
    '--color-primary-50': '26 63 54',
    '--color-primary-100': '34 82 69',
    '--color-primary-200': '42 101 87',
    '--color-primary-300': '52 122 104',
    '--color-primary-400': '62 143 124',
    '--color-primary-500': '94 164 154',
    '--color-primary-600': '127 184 167',
    '--color-primary-700': '170 206 197',
    '--color-primary-800': '217 235 229',
    '--color-primary-900': '240 247 245',
    '--color-primary-950': '245 250 248',

    '--color-secondary-0': '16 15 13',
    '--color-secondary-50': '30 28 25',
    '--color-secondary-100': '44 42 38',
    '--color-secondary-200': '74 69 64',
    '--color-secondary-300': '107 102 96',
    '--color-secondary-400': '154 147 138',
    '--color-secondary-500': '184 178 168',
    '--color-secondary-600': '210 204 191',
    '--color-secondary-700': '232 226 214',
    '--color-secondary-800': '244 241 235',
    '--color-secondary-900': '251 249 245',
    '--color-secondary-950': '255 255 255',

    '--color-tertiary-0': '111 60 38',
    '--color-tertiary-50': '143 79 53',
    '--color-tertiary-100': '175 98 68',
    '--color-tertiary-200': '201 117 84',
    '--color-tertiary-300': '220 136 102',
    '--color-tertiary-400': '232 155 122',
    '--color-tertiary-500': '237 168 140',
    '--color-tertiary-600': '242 191 162',
    '--color-tertiary-700': '247 213 196',
    '--color-tertiary-800': '252 233 224',
    '--color-tertiary-900': '255 240 232',
    '--color-tertiary-950': '255 247 244',

    '--color-error-0': '80 20 20',
    '--color-error-50': '110 30 30',
    '--color-error-100': '135 40 40',
    '--color-error-200': '160 55 55',
    '--color-error-300': '180 70 70',
    '--color-error-400': '196 87 87',
    '--color-error-500': '210 115 115',
    '--color-error-600': '225 140 140',
    '--color-error-700': '240 175 175',
    '--color-error-800': '250 210 210',
    '--color-error-900': '255 235 235',
    '--color-error-950': '255 245 245',

    '--color-success-0': '16 38 32',
    '--color-success-50': '26 63 54',
    '--color-success-100': '34 82 69',
    '--color-success-200': '42 101 87',
    '--color-success-300': '50 122 104',
    '--color-success-400': '62 143 124',
    '--color-success-500': '80 170 156',
    '--color-success-600': '106 192 179',
    '--color-success-700': '140 210 198',
    '--color-success-800': '174 224 215',
    '--color-success-900': '210 238 232',
    '--color-success-950': '240 250 248',

    '--color-warning-0': '94 56 16',
    '--color-warning-50': '124 76 24',
    '--color-warning-100': '155 98 32',
    '--color-warning-200': '186 121 40',
    '--color-warning-300': '212 144 48',
    '--color-warning-400': '229 169 60',
    '--color-warning-500': '237 192 85',
    '--color-warning-600': '245 210 112',
    '--color-warning-700': '250 225 144',
    '--color-warning-800': '254 238 184',
    '--color-warning-900': '255 246 218',
    '--color-warning-950': '255 252 238',

    '--color-info-0': '22 43 72',
    '--color-info-50': '33 60 96',
    '--color-info-100': '45 79 120',
    '--color-info-200': '59 99 144',
    '--color-info-300': '74 120 165',
    '--color-info-400': '91 141 184',
    '--color-info-500': '117 166 210',
    '--color-info-600': '142 184 220',
    '--color-info-700': '170 202 231',
    '--color-info-800': '195 218 238',
    '--color-info-900': '220 234 245',
    '--color-info-950': '240 246 252',

    '--color-typography-0': '30 28 25',
    '--color-typography-50': '44 42 38',
    '--color-typography-100': '60 56 52',
    '--color-typography-200': '80 76 72',
    '--color-typography-300': '107 102 96',
    '--color-typography-400': '130 125 120',
    '--color-typography-500': '154 147 138',
    '--color-typography-600': '175 170 165',
    '--color-typography-700': '200 196 192',
    '--color-typography-800': '225 222 218',
    '--color-typography-900': '245 243 240',
    '--color-typography-950': '254 254 254',

    '--color-outline-0': '25 23 21',
    '--color-outline-50': '40 38 35',
    '--color-outline-100': '60 56 52',
    '--color-outline-200': '90 85 80',
    '--color-outline-300': '120 115 110',
    '--color-outline-400': '154 147 138',
    '--color-outline-500': '185 180 174',
    '--color-outline-600': '210 205 198',
    '--color-outline-700': '232 226 214',
    '--color-outline-800': '240 237 232',
    '--color-outline-900': '248 246 242',
    '--color-outline-950': '255 255 254',

    '--color-background-0': '25 23 21',
    '--color-background-50': '40 38 35',
    '--color-background-100': '55 52 48',
    '--color-background-200': '80 76 70',
    '--color-background-300': '110 105 98',
    '--color-background-400': '140 135 128',
    '--color-background-500': '170 165 158',
    '--color-background-600': '192 187 180',
    '--color-background-700': '215 210 202',
    '--color-background-800': '232 226 214',
    '--color-background-900': '244 241 235',
    '--color-background-950': '251 249 245',

    '--color-background-error': '66 30 30',
    '--color-background-warning': '65 50 20',
    '--color-background-success': '20 45 40',
    '--color-background-muted': '51 49 46',
    '--color-background-info': '25 40 60',

    '--color-indicator-primary': '94 164 154',
    '--color-indicator-info': '117 166 210',
    '--color-indicator-error': '210 115 115',
  }),
};
