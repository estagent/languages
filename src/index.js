import collection from './collection';
import translate from './translator';
import {detectLang, setLocale, selectLocale} from './detector';
import mergeTranslations from './loader';
import locales from './lang/locales';
import translations from './lang/translations';

const locale = () => config('app.locale');

const langName = code => locales[locale()][code ?? locale()];

const language = code => {
    if (!code) code = locale();
    return {
        code: code,
        name: locales[locale()][code],
        native: locales[code][code],
    };
};
const languages = codes => {
    if (!codes) codes = Object.keys(locales);
    if (!Array.isArray(codes))
        throw 'input must be array or *null*  for system codes';
    const data = [];
    for (let code of codes) data.push(language(code));
    return data;
};

const globalizeLang = key => {
    window['mergeTranslations'] = mergeTranslations;
    if (key !== false) {
        if (typeof key !== 'string')
            throw 'global function name must be string';
        else if (window[key] === undefined)
            throw `global ${key} for translate is already exists`;
        else window[key] = translate;
    }
};

export default function (opts = {}) {
    if (opts.hasOwnProperty('locale')) {
        if (opts.locale === 'detect') detectLang();
        else setLocale(opts.locale);
    } else detectLang();

    if (opts.hasOwnProperty('fallback_locale'))
        config({'app.fallback_locale': opts.fallback_locale});

    if (!locale()) throw 'language not set!';

    if (opts.hasOwnProperty('default_priority'))
        collection.default_priority = opts.default_priority === true;

    if (opts.hasOwnProperty('fallback_priority'))
        collection.fallback_priority = opts.fallback_priority === true;

    if (typeof opts.unsupported_locale == 'string')
        collection.unsupported_locale = opts.unsupported_locale;

    if (opts.hasOwnProperty('translations'))
        if (typeof opts.translations !== 'object')
            throw 'translations root must be object! use {} for empty';
        else collection.translations = opts.translations;

    if (opts.hasOwnProperty('locale_siblings')) {
        if (typeof opts.locale_siblings !== 'object')
            throw 'translations root must be object! use {} for empty';
        collection.siblings = opts.locale_siblings;
    }

    mergeTranslations('languages', translations);
    globalizeLang(opts.hasOwnProperty('lang_global') ? opts.lang_global : '__');

    return {
        locale: () => locale,
        setLocale: setLocale,
        selectLocale: selectLocale,
        language: language,
        languages: languages,
        langName: langName,
        translate: translate,
        mergeTranslations: mergeTranslations,
    };
}
