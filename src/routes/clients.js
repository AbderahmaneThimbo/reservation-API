import express from "express";
import ClientController from "../controllers/ClientController.js";

const router = express.Router();

router.post("/clients", ClientController.creerClient);
router.get("/clients", ClientController.getClients);
router.get("/clients/:id", ClientController.getClientById);
router.put("/clients/:id", ClientController.mettreAJourClient);
router.delete("/clients/:id", ClientController.supprimerClient);

export default router;
