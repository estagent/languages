import {config} from '@revgaming/config';
import {detectLang, setLocale, selectLocale} from './detector';
import mergeTranslations from './loader';
import translate from './translator';
import collection from './collection';
import locales from './lang/locales';
import translations from './lang/translations';

export {translate, setLocale, selectLocale, mergeTranslations};
export const locale = () => config('app.locale');
export const langName = code => locales[locale()][code ?? locale()];
export const language = code => {
    if (!code) code = locale();
    return {
        code: code,
        name: locales[locale()][code],
        native: locales[code][code],
    };
};
export const languages = codes => {
    if (!codes) codes = Object.keys(locales);
    if (!Array.isArray(codes))
        throw 'input must be array or *null*  for system codes';
    const data = [];
    for (let code of codes) data.push(language(code));
    return data;
};
const globalizeLang = key => {
    if (key === false) return;
    if (typeof key !== 'string') throw 'global function name must be string';
    else if (window[key] !== undefined)
        throw `global ${key} for translate is already exists`;
    else window[key] = translate;
};
export const bootLanguages = opts => {
    if (opts.hasOwnProperty('translations'))
        if (typeof opts.translations !== 'object')
            throw 'translations root must be object! use {} for empty';
        else collection.translations = opts.translations;

    if (opts.hasOwnProperty('locale_siblings')) {
        if (typeof opts.locale_siblings !== 'object')
            throw 'locale_siblings must be object!';
        collection.siblings = opts.locale_siblings;
    }

    if (opts.hasOwnProperty('locale_alternatives')) {
        if (typeof opts.alternatives !== 'object')
            throw 'alternatives must be object!';
        collection.alternatives = opts.locale_alternatives;
    }

    if (opts.hasOwnProperty('locale')) {
        if (opts.locale === 'detect') detectLang();
        else if (typeof opts.locale === 'object') detectLang(opts.locale);
        else setLocale(opts.locale);
    } else detectLang();

    mergeTranslations('languages', translations);
    window['mergeTranslations'] = mergeTranslations;
    globalizeLang(opts.lang_global ?? '__');

    return {
        locale: locale,
        setLocale: setLocale,
        translate: translate,
    };
};
