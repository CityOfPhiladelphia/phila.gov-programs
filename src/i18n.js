import Vue from 'vue';
import VueI18n from 'vue-i18n';

Vue.use(VueI18n);

export const i18n = new VueI18n({
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    "en": '',
  },
});

function setI18nLanguage (lang) {
  i18n.locale = lang;
  document.querySelector('html').setAttribute('lang', lang);
  return lang;
}

export function loadLanguageAsync (lang) {
  i18n.setLocaleMessage(lang, languages[lang]);
  return setI18nLanguage(lang);
}

const languages = {
  'en': {
    "Search" : "Search by title or keyword",
    "Filter by category" : "Filter by category",
    "Filter by audience" : "Filter by audience",
    "Showing": "Showing",
    "Programs": "programs",
    "Next": "Next",
    "Previous": "Previous",
    "Clear all filters": "Clear all filters",
    "No results":"Sorry, there are no results.",
    "Try again":"Sorry, there was a problem. Please try again.",
  },
  'es': {
    "Search" : "Búsqueda por título o palabra clave",
    "Filter by category" : "Filtrar por categoría",
    "Filter by audience" : "Filtrar por audiencia",
    "Showing": "Mostrando",
    "Programs": "programas",
    "Next": "Próximo",
    "Previous": "Anterior",
    "Clear all filters": "Borrar todos los filtros",
    "No results":"Lo sentimos, no hay resultados.",
    "Try again":"Lo siento, ha habido un problema. Por favor, inténtalo de nuevo.",
  },
  'zh': {
    "Search" : "按标题或关键字搜索",
    "Filter by category" : "按类别筛选",
    "Filter by audience" : "按受众筛选",
    "Showing": "显示",
    "Programs": "节目",
    "Next": "下一步",
    "Previous": "以前",
    "Clear all filters": "清除所有筛选条件",
    "No results": "抱歉，没有结果。",
    "Try again": "抱歉，出现了一个问题。请再试一次。",
  },
};