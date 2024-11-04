import { check, param, validationResult } from "express-validator";
import prisma from "../config/prisma.js";
import { StatusCodes } from "http-status-codes";
import i18next from "../i18nextConfig.js";

const creerReservationValidator = [
  check("dateDebut")
    .notEmpty()
    .withMessage(i18next.t("validator.dateDebutRequired"))
    .bail()
    .isISO8601()
    .withMessage(i18next.t("validator.dateDebutInvalid"))
    .bail()
    .custom((value, { req }) => {
      if (new Date(value) >= new Date(req.body.dateFin)) {
        throw new Error(i18next.t("validator.dateDebutBeforeDateFin"));
      }
      return true;
    }),

  check("dateFin")
    .notEmpty()
    .withMessage(i18next.t("validator.dateFinRequired"))
    .bail()
    .isISO8601()
    .withMessage(i18next.t("validator.dateFinInvalid"))
    .bail(),

  check("chambreId")
    .notEmpty()
    .withMessage(i18next.t("validator.chambreIdRequired"))
    .bail()
    .isInt({ min: 1 })
    .withMessage(i18next.t("validator.chambreIdPositiveInt"))
    .bail()
    .custom(async value => {
      const chambre = await prisma.chambre.findUnique({
        where: { id: value }
      });
      if (!chambre) {
        throw new Error(i18next.t("validator.chambreNotFound"));
      }
      return true;
    }),

  check("clientId")
    .notEmpty()
    .withMessage(i18next.t("validator.clientIdRequired"))
    .bail()
    .isInt({ min: 1 })
    .withMessage(i18next.t("validator.clientIdPositiveInt"))
    .bail()
    .custom(async value => {
      const client = await prisma.client.findUnique({
        where: { id: value }
      });
      if (!client) {
        throw new Error(i18next.t("validator.clientNotFound"));
      }
      return true;
    }),

  check("status")
    .optional()
    .isIn(["EN_ATTENTE", "CONFIRMEE"])
    .withMessage(i18next.t("validator.statusInvalid")),

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
    .withMessage(i18next.t("validator.reservationIdRequired"))
    .bail()
    .custom(async value => {
      const reservation = await prisma.reservation.findUnique({
        where: { id: parseInt(value) }
      });
      if (!reservation) {
        throw new Error(i18next.t("validator.reservationNotFound"));
      }
      return true;
    }),

  check("dateDebut")
    .optional()
    .isISO8601()
    .withMessage(i18next.t("validator.dateDebutInvalid"))
    .bail()
    .custom((value, { req }) => {
      if (req.body.dateFin && new Date(value) >= new Date(req.body.dateFin)) {
        throw new Error(i18next.t("validator.dateDebutBeforeDateFin"));
      }
      return true;
    }),

  check("dateFin")
    .optional()
    .isISO8601()
    .withMessage(i18next.t("validator.dateFinInvalid"))
    .bail(),

  check("chambreId")
    .optional()
    .isInt({ min: 1 })
    .withMessage(i18next.t("validator.chambreIdPositiveInt"))
    .bail()
    .custom(async value => {
      const chambre = await prisma.chambre.findUnique({
        where: { id: value }
      });
      if (!chambre) {
        throw new Error(i18next.t("validator.chambreNotFound"));
      }
      return true;
    }),

  check("clientId")
    .optional()
    .isInt({ min: 1 })
    .withMessage(i18next.t("validator.clientIdPositiveInt"))
    .bail()
    .custom(async value => {
      const client = await prisma.client.findUnique({
        where: { id: value }
      });
      if (!client) {
        throw new Error(i18next.t("validator.clientNotFound"));
      }
      return true;
    }),

  check("status")
    .optional()
    .isIn(["EN_ATTENTE", "CONFIRMEE"])
    .withMessage(i18next.t("validator.statusInvalid")),

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
    .withMessage(i18next.t("validator.reservationIdRequired"))
    .bail()
    .custom(async value => {
      const reservation = await prisma.reservation.findUnique({
        where: { id: parseInt(value) }
      });
      if (!reservation) {
        throw new Error(i18next.t("validator.reservationNotFound"));
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
