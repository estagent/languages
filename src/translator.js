import {replaceAttributes} from '@revgaming/helpers';
import collection from './collection';

const fromFallback = code => {
    if (
        !config('app.fallback') ||
        config('app.locale') === config('app.fallback')
    )
        return code;

    const fallback = collection.translations[config('app.fallback')];

    let value;
    try {
        if (fallback) value = eval(`fallback.${code}`);
    } catch (err) {
        console.error(err);
    }
    return value ?? code;
};

const translate = function (key) {
    if (!config('app.locale')) throw 'locale not set';

    const translations = collection.translations[config('app.locale')];

    if (!translations) throw 'translation not set';

    if (typeof key !== 'string') throw 'invalid lang input';
    if (!key) throw 'language code empty!';

    let value;

    try {
        value = eval(`translations.${key}`);
    } catch (err) {
        // console.error(err);
        return fromFallback(key);
    }
    return value ?? fromFallback(key);
};

export default function (code, attributes) {
    return replaceAttributes(translate(code), attributes);
}
