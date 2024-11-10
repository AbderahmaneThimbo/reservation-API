import express from "express";
import {
  creerChambre,
  afficherChambres,
  afficherChambreParId,
  afficherChambresDisponibles,
  mettreAJourChambre,
  supprimerChambre
} from "../controllers/ChambreController.js";
import {
  creerChambreValidator,
  mettreAjourChambreValidator,
  supprimerChambreValidator
} from "../validators/ChambreValidator.js";
import { authMiddleware } from "../middlewares/auth.js";

const router = express.Router();

router.post("/chambres", authMiddleware, creerChambreValidator, creerChambre);
router.get("/chambres", authMiddleware, afficherChambres);
router.get("/chambres/:id", authMiddleware, afficherChambreParId);
router.get(
  "/chambres-disponibles",
  authMiddleware,
  afficherChambresDisponibles
);
router.put(
  "/chambres/:id",
  authMiddleware,
  mettreAjourChambreValidator,
  mettreAJourChambre
);
router.delete(
  "/chambres/:id",
  authMiddleware,
  supprimerChambreValidator,
  supprimerChambre
);

export default router;
