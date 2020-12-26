import config from './config';
import variables from './variables';
import translate from './translator';
import {detectLang, setLocale, selectLocale} from './detector';
import mergeTranslations from './loader';
import locales from './lang/locales';

const langName = code => locales[variables.locale][code ?? variables.locale];

const language = code => {
    if (!code) code = variables.locale;
    return {
        code: code,
        name: locales[variables.locale][code],
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

const registerGlobals = function (key) {
    window[key] = translate;
    window['mergeTranslations'] = mergeTranslations;
    return this;
};

export default function (opts) {
    for (const key of Object.keys(config)) {
        if (opts.hasOwnProperty(key)) config[key] = opts[key];
    }

    if (!setLocale(opts.locale))
        if (!detectLang(opts.locale)) throw 'language not set!';

    if (opts.translations) variables.translations = opts.translations;
    if (opts.siblings) variables.siblings = opts.siblings;

    mergeTranslations('languages', require('./lang/translations'));

    registerGlobals(opts.global ?? '__');

    return {
        locale: () => variables.locale,
        setLocale: setLocale,
        selectLocale: selectLocale,
        language: language,
        languages: languages,
        langName: langName,
        translate: translate,
        mergeTranslations: mergeTranslations,
    };
}
