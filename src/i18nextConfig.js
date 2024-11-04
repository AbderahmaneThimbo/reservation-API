import dotenv from "dotenv";
import i18next from "i18next";
import fr from "./locales/fr.json" assert { type: "json" };
import en from "./locales/en.json" assert { type: "json" };
import ar from "./locales/ar.json" assert { type: "json" };

dotenv.config(); 

i18next.init({
  lng: process.env.LANGUAGE || "fr", 
  fallbackLng: "en", 
  resources: {
    en: { translation: en },
    fr: { translation: fr },
    ar: { translation: ar },
  },
});

export default i18next;
