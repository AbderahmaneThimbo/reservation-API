import express from "express";
import TypeChambreController from "../controllers/TypeChambreController.js";

const router = express.Router();

router.post("/types", TypeChambreController.creerTypeChambre);
router.get("/types/:id", TypeChambreController.getTypeChambreById);
router.get("/types", TypeChambreController.getTypeChambres);
router.put("/types/:id", TypeChambreController.mettreAJourTypeChambre);
router.delete("/types/:id", TypeChambreController.supprimerTypeChambre);

export default router;
