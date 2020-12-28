import siblings from './data/siblings';
import alternatives from './data/alternatives';

export default {
    default_priority: false, // if env.APP_LOCALE (default/server-side) found in browser this will skip browser order
    fallback_priority: false, // if env.APP_FALLBACK found in browser skip browser order ( checked after default priority)
    unsupported_locale: null, // useful if you use your native as default app.locale (not in  fallback) : if not defined, env.APP_LOCALE will be used.
    siblings: siblings, // dominated language will be used for matching assimilation
    alternatives: alternatives, // different naming for locales,  like eng => en  code-3 to code-2,
    translations: {},
};
