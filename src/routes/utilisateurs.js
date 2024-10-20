import express from "express";
import UtilisateurController from "../controllers/UtilisateurController.js";

const router = express.Router();

router.post("/utilisateurs", UtilisateurController.creerUtilisateur);
router.get("/utilisateurs", UtilisateurController.getUtilisateurs);
router.get("/utilisateurs/:id", UtilisateurController.getUtilisateurById);
router.put("/utilisateurs/:id", UtilisateurController.updateUtilisateur);
router.delete("/utilisateurs/:id", UtilisateurController.supprimerUtilisateur);

export default router;
