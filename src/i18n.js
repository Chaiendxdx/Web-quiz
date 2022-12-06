import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import Backend from "i18next-http-backend";
i18n

  .use(Backend)
  // detect user language
  // learn more: https://github.com/i18next/i18next-browser-languageDetector
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    debug: false,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    // resources: {
    //   en: {},
    //   vi: {
    //     translation: {
    //       homepage: {
    //         title1: "Có rất nhiều cách để học",
    //         title2: `Bạn không muốn học 1 cách tẻ nhạt? Và bạn thích làm các bài trắc nghiệm? Cùng bắt đầu với chúng tôi — và khiến bản thân trở nên thông minh hơn nào.`,
    //         title3: {
    //           login: "Cùng bắt đầu nào!",
    //           signup: "Làm bài kiểm tra nào!",
    //         },
    //       },
    //     },
    //   },
    // },
  });

export default i18n;
