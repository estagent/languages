import {config} from '@revgaming/config'
import {detectLang, setLocale} from './detector'
import mergeTranslations from './loader'
import translate from './translator'
import locales from './lang/locales'
import translations from './lang/translations'

export {translate, setLocale, mergeTranslations}
export const locale = () => config('app.locale')
export const langName = code => locales[locale()][code ?? locale()]
export const language = code => {
  if (!code) code = locale()
  return {
    code: code,
    name: locales[locale()][code],
    native: locales[code][code],
  }
}
export const languages = codes => {
  if (!codes) codes = Object.keys(locales)
  if (!Array.isArray(codes))
    throw 'input must be array or *null*  for system codes'
  const data = []
  for (let code of codes) data.push(language(code))
  return data
}
const globalizeLang = key => {
  if (key === false) return
  if (typeof key !== 'string') throw 'global function name must be string'
  else if (window[key] !== undefined)
    throw `global ${key} for translate is already exists`
  else window[key] = translate
}

export const __ = translate

export const bootLanguages = opts => {
  if (opts.hasOwnProperty('locale')) {
    if (opts.locale === 'detect') detectLang()
    else if (typeof opts.locale === 'object') detectLang(opts.locale)
    else setLocale(opts.locale)
  } else detectLang()
  if (opts.hasOwnProperty('translations')) mergeTranslations(opts.translations)
  mergeTranslations('languages', translations)
  globalizeLang(opts.lang_global ?? '__')
  return {
    locale: locale,
    setLocale: setLocale,
    translate: translate,
    languages: languages,
    langName: langName,
    mergeTranslations: mergeTranslations,
  }
}
