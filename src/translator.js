import {replaceAttributes} from '@revgaming/helpers';
import variables from './variables';
import config from './config';

const translateFallback = code => {
    if (!variables.translations) throw 'translations not set';
    const __fallback = variables.translations[config.fallback];

    let value;
    try {
        if (__fallback) value = eval(`__fallback.${code}`);
    } catch (err) {
        console.error(err);
    }
    return value;
};

const translate = function (key) {
    if (!variables.locale) throw 'locale not set';

    const __translation = variables.translations[variables.locale];

    if (!__translation) throw 'translation not set';

    if (typeof key !== 'string') throw 'invalid lang input';
    if (!key) throw 'language code empty!';

    let value;

    try {
        value = eval(`__translation.${key}`);
    } catch (err) {
        // console.error(err);
        return translateFallback(key);
    }
    return value ?? translateFallback(key);
};

export default function (code, attributes) {
    return replaceAttributes(translate(code), attributes);
}
