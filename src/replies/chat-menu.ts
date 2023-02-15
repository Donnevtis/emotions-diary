import { Context } from 'telegraf'
import { t } from '../services/locale'
import { createURL } from '../utils/common'

export async function updateChatMenuButton(this: Context) {
  return this.setChatMenuButton({
    type: 'web_app',
    text: t('MENU_BUTTON_TEXT'),
    web_app: {
      url: createURL(this.from?.id),
    },
  })
}
