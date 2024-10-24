import express from "express";
import {
  creerUtilisateur,
  afficherUtilisateurParId,
  afficherUtilisateurs,
  supprimerUtilisateur,
  mettreAjourUtilisateur
} from "../controllers/UtilisateurController.js";
import { authMiddleware, adminMiddleware } from "../middlewares/auth.js";
import {
  creerUtilisateurValidator,
  mettreAjourUtilisateurValidator,
  supprimerUtilisateurValidator
} from "../validators/UtilisateurValidator.js";

const router = express.Router();

router.post(
  "/utilisateurs",
  authMiddleware,
  adminMiddleware,
  creerUtilisateurValidator,
  creerUtilisateur
);
router.get(
  "/utilisateurs",
  authMiddleware,
  adminMiddleware,
  afficherUtilisateurs
);
router.get(
  "/utilisateurs/:id",
  authMiddleware,
  adminMiddleware,
  afficherUtilisateurParId
);
router.put(
  "/utilisateurs/:id",
  authMiddleware,
  adminMiddleware,
  mettreAjourUtilisateurValidator,
  mettreAjourUtilisateur
);
router.delete(
  "/utilisateurs/:id",
  authMiddleware,
  adminMiddleware,
  supprimerUtilisateurValidator,
  supprimerUtilisateur
);

export default router;
