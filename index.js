import express from "express";
import dotenv from "dotenv";
import i18next from "i18next";
import i18nextMiddleware from "i18next-express-middleware";
import Backend from "i18next-fs-backend";
import path from "path";
import loginRoute from "./src/api/login.js";
import utilisateurRoutes from "./src/routes/utilisateurs.js";
import clientRoutes from "./src/routes/clients.js";
import typeRoutes from "./src/routes/type.js";
import chambreRoutes from "./src/routes/chambre.js";
import reservationRoutes from "./src/routes/reservation.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use("/api/login", loginRoute);
app.use(
  "/api",
  utilisateurRoutes,
  clientRoutes,
  typeRoutes,
  chambreRoutes,
  reservationRoutes
);

i18next.use(Backend).use(i18nextMiddleware.LanguageDetector).init({
  fallbackLng: "en",
  supportedLngs: ["en", "fr", "ar"],
  backend: {
    loadPath: path.join(__dirname, "/locales/{{lng}}/translation.json")
  },
  detection: {
    order: ["querystring", "cookie", "header"],
    caches: ["cookie"]
  },
  preload: ["en", "fr", "ar"]
});

app.use(i18nextMiddleware.handle(i18next));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
