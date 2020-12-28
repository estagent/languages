import navigatorLanguages from 'navigator-languages';
import collection from './collection';
import Preference from '@revgaming/preference';
import locales from './lang/locales';

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

export const detectLang = () => {
    if (setLocale(Preference.get('language'))) return true;

    const langs = getUserLangCodes();

    if (collection.default_priority) {
        if (langs.includes(config('app.locale')))
            if (setLocale(config('app.locale'))) return true;
    }

    if (collection.fallback_priority) {
        if (langs.includes(config('app.fallback_locale')))
            if (setLocale(config('app.fallback_locale'))) return true;
    }

    for (let code of langs) {
        if (setLocale(code)) {
            return true;
        } else if (setLocale(getSibling(code))) {
            return true;
        } else console.log(`user ${code} not supported`);
    }

    console.log('any of supported language(s) is not detected');

    if (collection.unsupported_locale)
        return setLocale(collection.unsupported_locale);
    // default locale will be used => env.APP_LOCALE already in config(app.locale)
    return false;
};
