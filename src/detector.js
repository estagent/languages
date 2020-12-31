import navigatorLanguages from 'navigator-languages'
import Preference from '@revgaming/preference'
import {config} from '@revgaming/config'
import locales from './lang/locales'
import collection from './collection'


const normalizeCode = code => {
  if (Object.keys(collection.alternatives).includes(code))
    return collection.alternatives[code]
  else return code
}

const getLangFromLocale = localeString => {
  const code =
    localeString.indexOf('-') === -1 ? localeString : localeString.split('-')[0]
  return normalizeCode(code.toLowerCase())
}

const getUserLangCodes = () => {
  const locales = navigatorLanguages()

  const userLanguages = []
  for (let locale of locales) {
    const code = getLangFromLocale(locale)
    if (code) userLanguages.push(code)
  }

  return userLanguages
}

const isValid = code => code && Object.keys(locales).includes(code)

export const setLocale = (code, preferred = false) => {
  if (isValid(code)) {
    config({'app.locale': code})
    if (preferred) Preference.set('language', config('app.locale'))
    return true
  }
  return false
}

export const detectLang = (opts = {}) => {
  const siblings = opts.siblings ?? collection.siblings
  if (opts.alternatives) collection.alternatives = opts.alternatives
  if (setLocale(Preference.get('language'))) return true
  const langs = getUserLangCodes()
  if (opts.hasOwnProperty('priorities')) {
    if (Array.isArray(opts.priorities)) {
      for (let locale of opts.priorities) {
        if (langs.includes(locale)) if (setLocale(locale)) return true
      }
    }
  }

  for (let code of langs) {
    if (setLocale(code)) {
      return true
    } else if (siblings[code] && setLocale(siblings[code])) {
      return true
    } else console.log(`user ${code} not supported`)
  }

  console.log('any of supported language(s) is not detected')

  if (opts.hasOwnProperty('default_foreign'))
    return setLocale(opts.default_foreign)

  // default locale will be used => env.APP_LOCALE already in config(app.locale)
  return false
}
