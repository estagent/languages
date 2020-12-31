import objectPath from 'object-path'
import collection from './collection'

const setData = (lang, key, data) => {
  if (!collection.translations.hasOwnProperty(lang))
    collection.translations[lang] = {}
  objectPath.set(collection.translations[lang], key, data)
}
const mergeTranslations = (mixed, opts) => {
  if (typeof mixed === 'string') {
    for (const lang of Object.keys(opts)) setData(lang, mixed, opts[lang])
  } else if (mixed instanceof Array) {
    mixed.forEach(translations => mergeTranslations(translations))
  } else if (typeof mixed === 'object') {
    for (const lang of Object.keys(mixed)) {
      for (const key of Object.keys(mixed[lang]))
        setData(lang, key, mixed[lang][key])
    }
  } else throw 'unsupported merge input for languages' + typeof mixed
}
export default mergeTranslations
