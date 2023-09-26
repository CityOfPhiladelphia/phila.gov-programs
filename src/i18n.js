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
    "Search": "Search by title or keyword",
    "Filter by category": "Filter by category",
    "Filter by audience": "Filter by audience",
    "Showing": "Showing",
    "Programs": "programs",
    "Next": "Next",
    "Previous": "Previous",
    "Clear all filters": "Clear all filters",
    "No results": "Sorry, there are no results.",
    "Try again": "Sorry, there was a problem. Please try again.",
  },
  'es': {
    "Search": "Búsqueda por título o palabra clave",
    "Filter by category": "Filtrar por categoría",
    "Filter by audience": "Filtrar por audiencia",
    "Showing": "Mostrando",
    "Programs": "programas",
    "Next": "Próximo",
    "Previous": "Anterior",
    "Clear all filters": "Borrar todos los filtros",
    "No results": "Lo sentimos, no hay resultados.",
    "Try again": "Lo siento, ha habido un problema. Por favor, inténtalo de nuevo.",
  },
  'zh': {
    "Search": "按标题或关键字搜索",
    "Filter by category": "按类别筛选",
    "Filter by audience": "按受众筛选",
    "Showing": "显示",
    "Programs": "节目",
    "Next": "下一步",
    "Previous": "以前",
    "Clear all filters": "清除所有筛选条件",
    "No results": "抱歉，没有结果。",
    "Try again": "抱歉，出现了一个问题。请再试一次。",
  },
  'ar': {
    "Search": "البحث حسب العنوان أو الكلمة الرئيسية",
    "Filter by category": "التصفية حسب الفئة",
    "Filter by audience": "التصفية حسب الجمهور",
    "Showing": "عرض",
    "Programs": "برامج",
    "Next": "التالي",
    "Previous": "السابق",
    "Clear all filters": "مسح جميع الفلاتر",
    "No results": "عذرًا، لا توجد نتائج",
    "Try again": "آسف، كانت هناك مشكلة. يرجى المحاولة مرة أخرى",
  },
  'ht': {
    "Search": "Rechèch pa tit oswa mo kle",
    "Filter by category": "Filtre pa kategori",
    "Filter by audience": "Filtre pa odyans",
    "Showing": "Montre",
    "Programs": "Pwogram",
    "Next": "Pwochen",
    "Previous": "Anvan",
    "Clear all filters": "Klè tout filtè",
    "No results": "Padon, pa gen okenn rezilta.",
    "Try again": "Padon, te gen yon pwoblèm. Tanpri eseye ankò.",
  },
  'fr': {
    "Search": "Recherche par titre ou mot-clé",
    "Filter by category": "Filtrer par catégorie",
    "Filter by audience": "Filtrer par public",
    "Showing": "Montrant",
    "Programs": "Programmes",
    "Next": "Suivant",
    "Previous": "Précédent",
    "Clear all filters": "Effacer tous les filtres",
    "No results": "Désolé, il n'y a aucun résultat.",
    "Try again": "Désolé, un problème est survenu. Veuillez réessayer.",
  },
  'sw': {
    "Search": "Tafuta kwa kichwa au neno kuu",
    "Filter by category": "Chuja kwa jamii",
    "Filter by audience": "Chuja na watazamaji",
    "Showing": "Kuonesha",
    "Programs": "Programu",
    "Next": "Ifuatayo",
    "Previous": "Iliyotangulia",
    "Clear all filters": "Futa vichungi vyote",
    "No results": "Samahani, hakuna matokeo.",
    "Try again": "Samahani, kulikuwa na tatizo. Tafadhali jaribu tena.",
  },
  'pt': {
    "Search": "Pesquise por título ou palavra-chave",
    "Filter by category": "Filtrar por categoria",
    "Filter by audience": "Filtrar por público",
    "Showing": "Mostrando",
    "Programs": "Programas",
    "Next": "Próximo",
    "Previous": "Anterior",
    "Clear all filters": "Limpar todos os filtros",
    "No results": "Desculpe, não há resultados.",
    "Try again": "Desculpe, houve um problema. Por favor, tente novamente.",
  },
  'ru': {
    "Search": "Поиск по заголовку или ключевому слову",
    "Filter by category": "Фильтровать по категории",
    "Filter by audience": "Фильтр по аудитории",
    "Showing": "показывая",
    "Programs": "Программы",
    "Next": "Следующий",
    "Previous": "предыдущий",
    "Clear all filters": "Очистить все фильтры",
    "No results": "Извините, результатов нет.",
    "Try again": "Извините, возникла проблема. Пожалуйста, попробуйте еще раз.",
  },
  'vi': {
    "Search": "Tìm kiếm theo tiêu đề hoặc từ khóa",
    "Filter by category": "Lọc theo danh mục",
    "Filter by audience": "Lọc theo đối tượng",
    "Showing": "Đang hiển thị",
    "Programs": "Các chương trình",
    "Next": "Tiếp",
    "Previous": "Trước",
    "Clear all filters": "Xóa tất cả các bộ lọc",
    "No results": "Xin lỗi, không có kết quả.",
    "Try again": "Xin lỗi, có một vấn đề. Vui lòng thử lại.",
  },
};
