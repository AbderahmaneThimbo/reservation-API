import express from "express";
import dotenv from "dotenv";

import i18next from "./src/i18nextConfig.js";
import i18nextMiddleware from "i18next-express-middleware";
import cors from "cors";
import helmet from "helmet";

import passwordResetRoutes from "./src/api/passwordReset.js";
import loginRoute from "./src/api/login.js";
import utilisateurRoutes from "./src/routes/utilisateurs.js";
import clientRoutes from "./src/routes/clients.js";
import typeRoutes from "./src/routes/type.js";
import chambreRoutes from "./src/routes/chambre.js";
import reservationRoutes from "./src/routes/reservation.js";

dotenv.config();

const app = express();

app.use(helmet());

const corsOptions = {
  origin: "http://localhost:5173",
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

app.use(express.json());

app.use(i18nextMiddleware.handle(i18next));
app.use("/api/password", passwordResetRoutes);
app.use("/api/login", loginRoute);
app.use(
  "/api",
  utilisateurRoutes,
  clientRoutes,
  typeRoutes,
  chambreRoutes,
  reservationRoutes
);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
