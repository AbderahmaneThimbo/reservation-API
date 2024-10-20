import express from "express";
import ChambreController from "../controllers/ChambreController.js";

const router = express.Router();

router.post("/chambres", ChambreController.creerChambre);
router.get("/chambres", ChambreController.getChambres);
router.get("/chambres/:id", ChambreController.getChambreById);
router.put("/chambres/:id", ChambreController.mettreAJourChambre);
router.delete("/chambres/:id", ChambreController.supprimerChambre);

export default router;
