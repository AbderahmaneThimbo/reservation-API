import { check, param, validationResult } from "express-validator";
import prisma from "../config/prisma.js";
import { StatusCodes } from "http-status-codes";

const creerChambreValidator = [
  check("numeroChambre")
    .notEmpty()
    .withMessage((_, { req }) => req.t("validator.numeroChambreRequired"))
    .bail()
    .isInt({ min: 1 })
    .withMessage((_, { req }) => req.t("validator.numeroChambrePositiveInt"))
    .bail()
    .custom(async (value, { req }) => {
      const chambreExistante = await prisma.chambre.findUnique({
        where: { numeroChambre: value }
      });
      if (chambreExistante) {
        throw new Error(req.t("validator.numeroChambreExists"));
      }
      return true;
    }),

  check("prix")
    .notEmpty()
    .withMessage((_, { req }) => req.t("validator.prixRequired"))
    .bail()
    .isFloat({ gt: 0 })
    .withMessage((_, { req }) => req.t("validator.prixPositive"))
    .bail(),

  check("typeId")
    .notEmpty()
    .withMessage((_, { req }) => req.t("validator.typeIdRequired"))
    .bail()
    .custom(async (value, { req }) => {
      const type = await prisma.typeChambre.findUnique({
        where: { id: value }
      });
      if (!type) {
        throw new Error(req.t("validator.typeIdNotFound"));
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

const mettreAjourChambreValidator = [
  param("id")
    .notEmpty()
    .withMessage((_, { req }) => req.t("validator.idRequired"))
    .bail()
    .custom(async (value, { req }) => {
      const chambre = await prisma.chambre.findUnique({
        where: { id: parseInt(value) }
      });
      if (!chambre) {
        throw new Error(req.t("validator.chambreNotFound"));
      }
      return true;
    }),

  check("numeroChambre")
    .optional()
    .isInt({ min: 1 })
    .withMessage((_, { req }) => req.t("validator.numeroChambrePositiveInt"))
    .bail()
    .custom(async (value, { req }) => {
      const chambreExistante = await prisma.chambre.findUnique({
        where: { numeroChambre: value }
      });
      if (chambreExistante && chambreExistante.id !== parseInt(req.params.id)) {
        throw new Error(req.t("validator.numeroChambreExists"));
      }
      return true;
    }),

  check("prix")
    .optional()
    .isFloat({ gt: 0 })
    .withMessage((_, { req }) => req.t("validator.prixPositive"))
    .bail(),

  check("typeId").optional().custom(async value => {
    const type = await prisma.typeChambre.findUnique({
      where: { id: value }
    });
    if (!type) {
      throw new Error(req.t("validator.typeIdNotFound"));
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

const supprimerChambreValidator = [
  param("id")
    .notEmpty()
    .withMessage((_, { req }) => req.t("validator.idRequired"))
    .bail()
    .custom(async (value, { req }) => {
      const chambre = await prisma.chambre.findUnique({
        where: { id: parseInt(value) }
      });
      if (!chambre) {
        throw new Error(req.t("validator.chambreNotFound"));
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
  creerChambreValidator,
  mettreAjourChambreValidator,
  supprimerChambreValidator
};
