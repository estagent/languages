import navigatorLanguages from 'navigator-languages';
import config from './config';
import variables from './variables';
import Preference from '@revgaming/preference';
import locales from './lang/locales';

const normalizeCode = code => {
  if (Object.keys(variables.alternatives).includes(code))
    return variables.alternatives[code];
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
  if (variables.siblings)
    if (variables.siblings.hasOwnProperty(lang))
      return variables.siblings[lang];
};

const isValid = code => code && Object.keys(locales).includes(code);

export const setLocale = code => {
  if (isValid(code)) {
    variables.locale = code;
    return true;
  }
  return false;
};

export const selectLocale = code => {
  if (setLocale(code)) {
    Preference.set('language', variables.locale);
    return true;
  }
  throw `${code} not supported`;
};

export const detectLang = () => {
  if (setLocale(Preference.get('language'))) return true;

  const userLanguages = getUserLangCodes();

  if (config.fallback_priority) {
    if (userLanguages.includes(config.fallback))
      if (setLocale(config.fallback)) return true;
  }

  for (let code of userLanguages) {
    if (setLocale(code)) {
      return true;
    } else if (setLocale(getSibling(code))) {
      return true;
    } else console.log(`user ${code} not supported`);
  }
  console.log('no valid language detected');
  return setLocale(config.foreign);
};
