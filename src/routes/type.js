import express from "express";
import {
  creerTypeChambre,
  afficherTypeChambres,
  afficherTypeChambreParId,
  afficherChambresByTypeChambre,
  mettreAJourTypeChambre,
  supprimerTypeChambre
} from "../controllers/TypeChambreController.js";
import { authMiddleware } from "../middlewares/auth.js";
import {
  creerTypeChambreValidator,
  mettreAJourTypeChambreValidator,
  supprimerTypeChambreValidator
} from "../validators/TypeValidator.js";
const router = express.Router();

router.post(
  "/types",
  authMiddleware,
  creerTypeChambreValidator,
  creerTypeChambre
);
router.get("/types/:id", authMiddleware, afficherTypeChambreParId);
router.get("/types", authMiddleware, afficherTypeChambres);
router.get(
  "/types/:id/chambres",
  authMiddleware,
  afficherChambresByTypeChambre
);
router.put(
  "/types/:id",
  authMiddleware,
  mettreAJourTypeChambreValidator,
  mettreAJourTypeChambre
);
router.delete(
  "/types/:id",
  authMiddleware,
  supprimerTypeChambreValidator,
  supprimerTypeChambre
);

export default router;
