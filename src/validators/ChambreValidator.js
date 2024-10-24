import { check, param, validationResult } from "express-validator";
import prisma from "../config/prisma.js";
import { StatusCodes } from "http-status-codes";

const creerChambreValidator = [
  check("numeroChambre")
    .notEmpty()
    .withMessage("Le numéro de la chambre est obligatoire.")
    .bail()
    .isInt({ min: 1 })
    .withMessage("Le numéro de la chambre doit être un entier positif.")
    .bail()
    .custom(async value => {
      const chambreExistante = await prisma.chambre.findUnique({
        where: { numeroChambre: value }
      });
      if (chambreExistante) {
        throw new Error("Ce numéro de chambre est déjà utilisé.");
      }
      return true;
    }),

  check("prix")
    .notEmpty()
    .withMessage("Le prix est obligatoire.")
    .bail()
    .isFloat({ gt: 0 })
    .withMessage("Le prix doit être un nombre supérieur à 0.")
    .bail(),

  check("typeId")
    .notEmpty()
    .withMessage("Le type de la chambre est obligatoire.")
    .bail()
    .custom(async value => {
      const type = await prisma.typeChambre.findUnique({
        where: { id: value }
      });
      if (!type) {
        throw new Error("Le type de chambre sélectionné n'existe pas.");
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
    .withMessage("L'id est obligatoire.")
    .bail()
    .custom(async value => {
      const chambre = await prisma.chambre.findUnique({
        where: { id: parseInt(value) }
      });
      if (!chambre) {
        throw new Error("La chambre n'existe pas.");
      }
      return true;
    }),

  check("numeroChambre")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Le numéro de la chambre doit être un entier positif.")
    .bail()
    .custom(async (value, { req }) => {
      const chambreExistante = await prisma.chambre.findUnique({
        where: { numeroChambre: value }
      });
      if (chambreExistante && chambreExistante.id !== parseInt(req.params.id)) {
        throw new Error("Ce numéro de chambre est déjà utilisé.");
      }
      return true;
    }),

  check("prix")
    .optional()
    .isFloat({ gt: 0 })
    .withMessage("Le prix doit être un nombre supérieur à 0.")
    .bail(),

  check("typeId").optional().custom(async value => {
    const type = await prisma.typeChambre.findUnique({
      where: { id: value }
    });
    if (!type) {
      throw new Error("Le type de chambre sélectionné n'existe pas.");
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
    .withMessage("L'id est obligatoire.")
    .bail()
    .custom(async value => {
      const chambre = await prisma.chambre.findUnique({
        where: { id: parseInt(value) }
      });
      if (!chambre) {
        throw new Error("La chambre n'existe pas.");
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
