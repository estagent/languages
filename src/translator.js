import objectPath from 'object-path'
import {replaceAttributes} from '@revgaming/helpers'
import collection from './collection'
import {config} from '@revgaming/config'

const fromFallback = key => {
    if (
        !config('app.fallback_locale') ||
        config('app.locale') === config('app.fallback_locale')
    )
        return key

    const fallback = collection.translations[config('app.fallback_locale')]
    return objectPath.get(fallback, key, key)
}

const translate = function (key) {
    if (!config('app.locale')) throw 'locale not set'

    const translations = collection.translations[config('app.locale')]
    if (!translations) throw 'translation not set'

    if (typeof key !== 'string') throw 'invalid lang input'
    if (!key) throw 'language code empty!'

    return objectPath.get(translations, key, null) ?? fromFallback(key)
}

export default function (key, attributes) {
    return replaceAttributes(translate(key), attributes)
}
