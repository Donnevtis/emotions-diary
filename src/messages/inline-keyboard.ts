import { CALLBACK_DATA, PATHS } from '../types'
import { createURL } from '../utils/common'
import { t } from '../services/locale'

const inlineKeyboard = {
  newState: (userId?: number) => ({
    inline_keyboard: [
      [
        {
          web_app: {
            url: createURL(userId),
          },
          text: t('NEW_STATE'),
        },
        {
          callback_data: CALLBACK_DATA.openMenu,
          text: t('OPEN_MENU'),
        },
      ],
    ],
  }),

  openSettings: (userId?: number) => ({
    inline_keyboard: [
      [
        {
          text: t('OPEN_SETTINGS'),
          web_app: {
            url: createURL(userId, PATHS.settings),
          },
        },
      ],
    ],
  }),

  openMenu: (userId?: number) => ({
    inline_keyboard: [
      [
        {
          text: t('HISTORY'),
          web_app: { url: createURL(userId, PATHS.history) },
        },
      ],
      [
        {
          text: t('GET_REPORT'),
          callback_data: CALLBACK_DATA.report,
        },
      ],
      [
        {
          text: t('REMINDERS_SETTINGS'),
          web_app: { url: createURL(userId, PATHS.settings) },
        },
      ],
      [
        {
          web_app: {
            url: createURL(userId),
          },
          text: t('NEW_STATE'),
        },
      ],
      [
        {
          callback_data: CALLBACK_DATA.closeMenu,
          text: t('CLOSE_MENU'),
        },
      ],
    ],
  }),

  report: () => ({
    inline_keyboard: [
      [
        {
          text: t('WEEK_REPORT'),
          callback_data: CALLBACK_DATA.weekReport,
        },
      ],
      [
        {
          text: t('MONTH_REPORT'),
          callback_data: CALLBACK_DATA.monthReport,
        },
      ],
      [
        {
          text: t('BACK'),
          callback_data: CALLBACK_DATA.backMenu,
        },
      ],
    ],
  }),
}

export default inlineKeyboard
