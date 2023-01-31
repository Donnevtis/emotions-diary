import i18n from 'i18n'
import * as en from '../messages/en'
import * as ru from '../messages/ru'
import { Emotions } from './localeService.types'

export class LocaleService {
  i18nProvider = i18n

  constructor(options: i18n.ConfigurationOptions) {
    this.i18nProvider.configure(options)
  }

  set locale(locale: string) {
    if (this.locales.some(l => l === locale)) {
      this.i18nProvider.setLocale(locale)
    }
  }

  get locale() {
    return this.i18nProvider.getLocale()
  }

  get locales() {
    return this.i18nProvider.getLocales()
  }

  translate(text: string) {
    return this.i18nProvider.__(text)
  }

  get emotions(): Promise<Emotions> {
    return import(`../messages/emotions/${this.locale}`)
  }
}

export default new LocaleService({
  staticCatalog: {
    en,
    ru,
  },
  defaultLocale: 'en',
})
