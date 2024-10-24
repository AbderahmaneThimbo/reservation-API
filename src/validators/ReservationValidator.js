import { check, param, validationResult } from "express-validator";
import prisma from "../config/prisma.js";
import { StatusCodes } from "http-status-codes";

const creerReservationValidator = [
  check("dateDebut")
    .notEmpty()
    .withMessage("La date de début est obligatoire.")
    .bail()
    .isISO8601()
    .withMessage("La date de début doit être une date valide.")
    .bail()
    .custom((value, { req }) => {
      if (new Date(value) >= new Date(req.body.dateFin)) {
        throw new Error("La date de début doit être avant la date de fin.");
      }
      return true;
    }),

  check("dateFin")
    .notEmpty()
    .withMessage("La date de fin est obligatoire.")
    .bail()
    .isISO8601()
    .withMessage("La date de fin doit être une date valide.")
    .bail(),

  check("chambreId")
    .notEmpty()
    .withMessage("L'ID de la chambre est obligatoire.")
    .bail()
    .isInt({ min: 1 })
    .withMessage("L'ID de la chambre doit être un entier positif.")
    .bail()
    .custom(async value => {
      const chambre = await prisma.chambre.findUnique({
        where: { id: value }
      });
      if (!chambre) {
        throw new Error("La chambre sélectionnée n'existe pas.");
      }
      return true;
    }),

  check("clientId")
    .notEmpty()
    .withMessage("L'ID du client est obligatoire.")
    .bail()
    .isInt({ min: 1 })
    .withMessage("L'ID du client doit être un entier positif.")
    .bail()
    .custom(async value => {
      const client = await prisma.client.findUnique({
        where: { id: value }
      });
      if (!client) {
        throw new Error("Le client sélectionné n'existe pas.");
      }
      return true;
    }),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(StatusCodes.UNPROCESSABLE_ENTITY)
        .json({ errors: errors.array() });
    }
    next();
  }
];

const mettreAjourReservationValidator = [
  param("id")
    .notEmpty()
    .withMessage("L'id de la réservation est obligatoire.")
    .bail()
    .custom(async value => {
      const reservation = await prisma.reservation.findUnique({
        where: { id: parseInt(value) }
      });
      if (!reservation) {
        throw new Error("La réservation n'existe pas.");
      }
      return true;
    }),

  check("dateDebut")
    .optional()
    .isISO8601()
    .withMessage("La date de début doit être une date valide.")
    .bail()
    .custom((value, { req }) => {
      if (req.body.dateFin && new Date(value) >= new Date(req.body.dateFin)) {
        throw new Error("La date de début doit être avant la date de fin.");
      }
      return true;
    }),

  check("dateFin")
    .optional()
    .isISO8601()
    .withMessage("La date de fin doit être une date valide.")
    .bail(),

  check("chambreId")
    .optional()
    .isInt({ min: 1 })
    .withMessage("L'ID de la chambre doit être un entier positif.")
    .bail()
    .custom(async value => {
      const chambre = await prisma.chambre.findUnique({
        where: { id: value }
      });
      if (!chambre) {
        throw new Error("La chambre sélectionnée n'existe pas.");
      }
      return true;
    }),

  check("clientId")
    .optional()
    .isInt({ min: 1 })
    .withMessage("L'ID du client doit être un entier positif.")
    .bail()
    .custom(async value => {
      const client = await prisma.client.findUnique({
        where: { id: value }
      });
      if (!client) {
        throw new Error("Le client sélectionné n'existe pas.");
      }
      return true;
    }),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(StatusCodes.UNPROCESSABLE_ENTITY)
        .json({ errors: errors.array() });
    }
    next();
  }
];

const supprimerReservationValidator = [
  param("id")
    .notEmpty()
    .withMessage("L'id de la réservation est obligatoire.")
    .bail()
    .custom(async value => {
      const reservation = await prisma.reservation.findUnique({
        where: { id: parseInt(value) }
      });
      if (!reservation) {
        throw new Error("La réservation n'existe pas.");
      }
      return true;
    }),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(StatusCodes.UNPROCESSABLE_ENTITY)
        .json({ errors: errors.array() });
    }
    next();
  }
];

export {
  creerReservationValidator,
  mettreAjourReservationValidator,
  supprimerReservationValidator
};
