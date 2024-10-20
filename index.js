import express from "express";
import dotenv from "dotenv";
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
