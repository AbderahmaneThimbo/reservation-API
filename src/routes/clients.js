import express from "express";
import ClientController from "../controllers/ClientController.js";
import { authMiddleware } from "../middlewares/auth.js";
const router = express.Router();

router.post("/clients", authMiddleware, ClientController.creerClient);
router.get("/clients", authMiddleware, ClientController.getClients);
router.get("/clients/:id", authMiddleware, ClientController.getClientById);
router.put("/clients/:id", authMiddleware, ClientController.mettreAJourClient);
router.delete("/clients/:id", authMiddleware, ClientController.supprimerClient);

export default router;
