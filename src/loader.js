import variables from './variables';

const mergeLanguage = (lang, key, data) => {
    if (!variables.translations) throw 'translations not set';

    if (!lang) throw 'lang must be  provided';
    if (typeof lang !== 'string') throw 'target must be object';

    if (!key) throw 'key must be provided';
    if (typeof key !== 'string') throw 'key must be string';

    if (!data) throw 'data must be  provided';
    if (typeof data !== 'object') throw 'data must be object';

    const translations = variables.translations;

    if (!translations.hasOwnProperty(lang)) translations[lang] = {};

    const target = translations[lang];

    if (!target.hasOwnProperty(key)) target[key] = {};

    const obj = target[key];
    for (const subKey of Object.keys(data)) {
        obj[subKey] = data[subKey];
    }
};

const mergeTranslations = function (mixed, opts) {
    {
        if (typeof mixed === 'string') {
            const {language, data} = opts;
            if (language) {
                mergeLanguage(language, mixed, data);
            } else {
                for (const code of Object.keys(opts)) {
                    mergeTranslations(mixed, {
                        language: code,
                        data: opts[code],
                    });
                }
            }
        } else if (typeof mixed == 'object') {
            for (const key of Object.keys(mixed)) {
                for (let code of Object.keys(mixed[key])) {
                    mergeTranslations(key, {
                        language: code,
                        data: mixed[key][code],
                    });
                }
            }
        }
    }
};

export default mergeTranslations;
