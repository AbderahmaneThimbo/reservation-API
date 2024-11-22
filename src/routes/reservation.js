import express from "express";
import {
  creerReservation,
  afficherReservations,
  afficherReservationParId,
  mettreAJourReservation,
  supprimerReservation,
  telechargerRecuReservation
} from "../controllers/ReservationController.js";
import { authMiddleware } from "../middlewares/auth.js";
import {
  creerReservationValidator,
  mettreAjourReservationValidator,
  supprimerReservationValidator
} from "../validators/ReservationValidator.js";

const router = express.Router();

router.post(
  "/reservations",
  authMiddleware,
  creerReservationValidator,
  creerReservation
);
router.get("/reservations", authMiddleware, afficherReservations);
router.get("/reservations/:id", authMiddleware, afficherReservationParId);
router.put(
  "/reservations/:id",
  authMiddleware,
  mettreAjourReservationValidator,
  mettreAJourReservation
);
router.delete(
  "/reservations/:id",
  authMiddleware,
  supprimerReservationValidator,
  supprimerReservation
);
router.get("/reservations/:id/recu", telechargerRecuReservation);

export default router;
