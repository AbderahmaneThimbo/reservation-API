import { check, param, validationResult } from "express-validator";
import prisma from "../config/prisma.js";
import { StatusCodes } from "http-status-codes";

export const creerTypeChambreValidator = [
  check("nom")
    .notEmpty()
    .withMessage("Le nom du type de chambre est obligatoire.")
    .bail()
    .isLength({ max: 50 })
    .withMessage("Maximum 50 caractères.")
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
    .withMessage("L'id du type de chambre est obligatoire.")
    .bail()
    .custom(async value => {
      const typeChambre = await prisma.typeChambre.findUnique({
        where: { id: parseInt(value) }
      });
      if (!typeChambre) {
        throw new Error("Le type de chambre n'existe pas.");
      }
      return true;
    }),

  check("nom")
    .optional()
    .matches(/^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/)
    .isLength({ max: 50 })
    .withMessage("Maximum 50 caractères.")
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
    .withMessage("L'id du type de chambre est obligatoire.")
    .bail()
    .custom(async value => {
      const typeChambre = await prisma.typeChambre.findUnique({
        where: { id: parseInt(value) }
      });
      if (!typeChambre) {
        throw new Error("Le type de chambre n'existe pas.");
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
