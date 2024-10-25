import { check, param, validationResult } from "express-validator";
import prisma from "../config/prisma.js";
import { StatusCodes } from "http-status-codes";

export const creerTypeChambreValidator = [
  check("nom")
    .notEmpty()
    .withMessage((_, { req }) => req.t("validator.nomRequired"))
    .bail()
    .isLength({ max: 50 })
    .withMessage((_, { req }) => req.t("validator.maxLength"))
    .bail(),

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

export const mettreAJourTypeChambreValidator = [
  param("id")
    .notEmpty()
    .withMessage((_, { req }) => req.t("validator.idRequired"))
    .bail()
    .custom(async value => {
      const typeChambre = await prisma.typeChambre.findUnique({
        where: { id: parseInt(value) }
      });
      if (!typeChambre) {
        throw new Error(req.t("validator.notFound"));
      }
      return true;
    }),

  check("nom")
    .optional()
    .matches(/^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/)
    .withMessage((_, { req }) => req.t("validator.invalidName"))
    .isLength({ max: 50 })
    .withMessage((_, { req }) => req.t("validator.maxLength"))
    .bail(),

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

export const supprimerTypeChambreValidator = [
  param("id")
    .notEmpty()
    .withMessage((_, { req }) => req.t("validator.idRequired"))
    .bail()
    .custom(async value => {
      const typeChambre = await prisma.typeChambre.findUnique({
        where: { id: parseInt(value) }
      });
      if (!typeChambre) {
        throw new Error(req.t("validator.notFound"));
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
