import { check, param, validationResult } from "express-validator";
import prisma from "../config/prisma.js";
import { StatusCodes } from "http-status-codes";

const creerReservationValidator = [
  check("dateDebut")
    .notEmpty()
    .withMessage((_, { req }) => req.t("validator.dateDebutRequired"))
    .bail()
    .isISO8601()
    .withMessage((_, { req }) => req.t("validator.dateDebutInvalid"))
    .bail()
    .custom((value, { req }) => {
      if (new Date(value) >= new Date(req.body.dateFin)) {
        throw new Error(req.t("validator.dateDebutBeforeDateFin"));
      }
      return true;
    }),

  check("dateFin")
    .notEmpty()
    .withMessage((_, { req }) => req.t("validator.dateFinRequired"))
    .bail()
    .isISO8601()
    .withMessage((_, { req }) => req.t("validator.dateFinInvalid"))
    .bail(),

  check("chambreId")
    .notEmpty()
    .withMessage((_, { req }) => req.t("validator.chambreIdRequired"))
    .bail()
    .isInt({ min: 1 })
    .withMessage((_, { req }) => req.t("validator.chambreIdPositiveInt"))
    .bail()
    .custom(async (value, { req }) => {
      const chambre = await prisma.chambre.findUnique({
        where: { id: value }
      });
      if (!chambre) {
        throw new Error(req.t("validator.chambreNotFound"));
      }
      return true;
    }),

  check("clientId")
    .notEmpty()
    .withMessage((_, { req }) => req.t("validator.clientIdRequired"))
    .bail()
    .isInt({ min: 1 })
    .withMessage((_, { req }) => req.t("validator.clientIdPositiveInt"))
    .bail()
    .custom(async (value, { req }) => {
      const client = await prisma.client.findUnique({
        where: { id: value }
      });
      if (!client) {
        throw new Error(req.t("validator.clientNotFound"));
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
    .withMessage((_, { req }) => req.t("validator.reservationIdRequired"))
    .bail()
    .custom(async (value, { req }) => {
      const reservation = await prisma.reservation.findUnique({
        where: { id: parseInt(value) }
      });
      if (!reservation) {
        throw new Error(req.t("validator.reservationNotFound"));
      }
      return true;
    }),

  check("dateDebut")
    .optional()
    .isISO8601()
    .withMessage((_, { req }) => req.t("validator.dateDebutInvalid"))
    .bail()
    .custom((value, { req }) => {
      if (req.body.dateFin && new Date(value) >= new Date(req.body.dateFin)) {
        throw new Error(req.t("validator.dateDebutBeforeDateFin"));
      }
      return true;
    }),

  check("dateFin")
    .optional()
    .isISO8601()
    .withMessage((_, { req }) => req.t("validator.dateFinInvalid"))
    .bail(),

  check("chambreId")
    .optional()
    .isInt({ min: 1 })
    .withMessage((_, { req }) => req.t("validator.chambreIdPositiveInt"))
    .bail()
    .custom(async (value, { req }) => {
      const chambre = await prisma.chambre.findUnique({
        where: { id: value }
      });
      if (!chambre) {
        throw new Error(req.t("validator.chambreNotFound"));
      }
      return true;
    }),

  check("clientId")
    .optional()
    .isInt({ min: 1 })
    .withMessage((_, { req }) => req.t("validator.clientIdPositiveInt"))
    .bail()
    .custom(async (value, { req }) => {
      const client = await prisma.client.findUnique({
        where: { id: value }
      });
      if (!client) {
        throw new Error(req.t("validator.clientNotFound"));
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
    .withMessage((_, { req }) => req.t("validator.reservationIdRequired"))
    .bail()
    .custom(async (value, { req }) => {
      const reservation = await prisma.reservation.findUnique({
        where: { id: parseInt(value) }
      });
      if (!reservation) {
        throw new Error(req.t("validator.reservationNotFound"));
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
