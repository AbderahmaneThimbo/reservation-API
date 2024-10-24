import express from "express";
import {
  creerClient,
  afficherClientParId,
  afficherClients,
  mettreAJourClient,
  supprimerClient
} from "../controllers/ClientController.js";
import {
  creerClientValidator,
  mettreAjourClientValidator,
  supprimerClientValidator
} from "../validators/ClientValidator.js";
import { authMiddleware } from "../middlewares/auth.js";

const router = express.Router();

router.post("/clients", authMiddleware, creerClientValidator, creerClient);
router.get("/clients", authMiddleware, afficherClients);
router.get("/clients/:id", authMiddleware, afficherClientParId);
router.put(
  "/clients/:id",
  authMiddleware,
  mettreAjourClientValidator,
  mettreAJourClient
);
router.delete(
  "/clients/:id",
  authMiddleware,
  supprimerClientValidator,
  supprimerClient
);

export default router;
