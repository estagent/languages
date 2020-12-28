import navigatorLanguages from 'navigator-languages';
import collection from './collection';
import Preference from '@revgaming/preference';
import locales from './lang/locales';
import {config} from '@revgaming/config';

const normalizeCode = code => {
    if (Object.keys(collection.alternatives).includes(code))
        return collection.alternatives[code];
    else return code;
};

const getLangFromLocale = localeString => {
    const code =
        localeString.indexOf('-') === -1
            ? localeString
            : localeString.split('-')[0];
    return normalizeCode(code.toLowerCase());
};

const getUserLangCodes = () => {
    const locales = navigatorLanguages();

    const userLanguages = [];
    for (let locale of locales) {
        const code = getLangFromLocale(locale);
        if (code) userLanguages.push(code);
    }

    return userLanguages;
};

const getSibling = lang => {
    if (collection.siblings)
        if (collection.siblings.hasOwnProperty(lang))
            return collection.siblings[lang];
};

const isValid = code => code && Object.keys(locales).includes(code);

export const setLocale = code => {
    if (isValid(code)) {
        config({'app.locale': code});
        return true;
    }
    return false;
};

export const selectLocale = code => {
    if (setLocale(code)) {
        Preference.set('language', config('app.locale'));
        return true;
    }
    throw `${code} not supported`;
};

export const detectLang = opts => {
    if (setLocale(Preference.get('language'))) return true;

    const langs = getUserLangCodes();

    if (opts.hasOwnProperty('priorities')) {
        if (Array.isArray(opts.priorities)) {
            for (let locale of opts.priorities) {
                if (langs.includes(locale))
                    if (setLocale(locale)) return true
            }
        }
    }

    for (let code of langs) {
        const sibling = getSibling(code);
        if (setLocale(code)) {
            return true;
        } else if (setLocale(sibling)) {
            return true;
        } else console.log(`user ${code} not supported`);
    }

    console.log('any of supported language(s) is not detected');

    if (opts.hasOwnProperty('default_foreign'))
        return setLocale(opts.default_foreign);

    // default locale will be used => env.APP_LOCALE already in config(app.locale)
    return false;
};
