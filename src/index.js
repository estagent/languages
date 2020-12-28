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



export default function (opts = {}) {
    if (opts.hasOwnProperty('locale')) {
        if (opts.locale === 'detect') detectLang();
        else setLocale(opts.locale);
    }

    if (opts.hasOwnProperty('fallback'))
        config({'app.fallback_locale': opts.fallback});

    if (!locale()) throw 'language not set!';

    if (opts.hasOwnProperty('default_priority'))
        collection.default_priority = opts.default_priority === true;

    if (opts.hasOwnProperty('fallback_priority'))
        collection.fallback_priority = opts.fallback_priority === true;

    if (opts.hasOwnProperty('unsupported'))
        collection.unsupported_locale = opts.unsupported_locale;

    if (opts.hasOwnProperty('translations'))
        if (typeof opts.translations !== 'object')
            throw 'translations root must be object! use {} for empty';
        else collection.translations = opts.translations;

    if (opts.hasOwnProperty('siblings')) collection.siblings = opts.siblings;

    mergeTranslations('languages', translations);

    if (opts.hasOwnProperty('global')) {
        if (typeof opts.global === 'string') window[opts.global] = translate;
        else if (opts.global === true) window['__'] = translate;
    }

    window['mergeTranslations'] = mergeTranslations;

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
