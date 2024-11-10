import express from "express";
import prisma from "../config/prisma.js";
import {
  creerUtilisateur,
  afficherUtilisateurParId,
  afficherUtilisateurs,
  supprimerUtilisateur,
  mettreAjourUtilisateur,
  mettreAjourProfil
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
router.put("/profil", authMiddleware, mettreAjourProfil);
router.delete(
  "/utilisateurs/:id",
  authMiddleware,
  adminMiddleware,
  supprimerUtilisateurValidator,
  supprimerUtilisateur
);

router.get("/me", authMiddleware, async (req, res) => {
  try {
    const utilisateur = await prisma.utilisateur.findUnique({
      where: { id: req.utilisateur.utilisateurId }
    });

    if (!utilisateur) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    return res.status(200).json({
      user: {
        nom: utilisateur.nom,
        email: utilisateur.email,
        role: utilisateur.role
      }
    });
  } catch (error) {
    return res.status(500).json({ message: "Erreur serveur", error });
  }
});

export default router;
