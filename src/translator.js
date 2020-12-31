import objectPath from 'object-path'
import collection from './collection'
import {replaceAttributes} from '@revgaming/helpers'
import {config} from '@revgaming/config'

const fromFallback = key => {
  if (
    !config('app.fallback_locale') ||
    config('app.locale') === config('app.fallback_locale')
  )
    return key
  return objectPath.get(
    collection.translations[config('app.fallback_locale')],
    key,
    key,
  )
}
const translate = function (key) {
  if (!config('app.locale')) throw 'locale not set'
  if (!key) throw 'language code empty!'
  return (
    objectPath.get(collection.translations[config('app.locale')], key, null) ??
    fromFallback(key)
  )
}
export default function (key, attributes) {
  return replaceAttributes(translate(key), attributes)
}
