import express from "express";
import { ReservationController } from "../controllers/ReservationController.js";

const router = express.Router();

router.post("/reservations", ReservationController.creerReservation);
router.get("/reservations", ReservationController.getReservations);
router.get("/reservations/:id", ReservationController.getReservationById);
router.put("/reservations/:id", ReservationController.mettreAJourReservation);
router.delete("/reservations/:id", ReservationController.supprimerReservation);

export default router;
