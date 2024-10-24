import { check, param, validationResult } from "express-validator";
import prisma from "../config/prisma.js";
import { StatusCodes } from "http-status-codes";

const creerClientValidator = [
  check("nom")
    .notEmpty()
    .withMessage("Le nom est obligatoire.")
    .bail()
    .matches(/^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/)
    .withMessage(
      "Le nom doit contenir uniquement des lettres et des caractères spéciaux autorisés."
    )
    .bail()
    .isLength({ min: 2 })
    .withMessage("Le nom doit contenir au moins 2 caractères.")
    .bail(),

  check("prenom")
    .notEmpty()
    .withMessage("Le prénom est obligatoire.")
    .bail()
    .matches(/^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/)
    .withMessage(
      "Le prénom doit contenir uniquement des lettres et des caractères spéciaux autorisés."
    )
    .bail()
    .isLength({ min: 2 })
    .withMessage("Le prénom doit contenir au moins 2 caractères.")
    .bail(),

  check("telephone")
    .notEmpty()
    .withMessage("Le numéro de téléphone est obligatoire.")
    .bail()
    .matches(/^[0-9]+$/)
    .withMessage(
      "Le numéro de téléphone doit contenir uniquement des chiffres."
    )
    .bail()
    .isLength({ min: 8, max: 15 })
    .withMessage("Le numéro de téléphone doit contenir entre 8 et 15 chiffres.")
    .bail()
    .custom(async value => {
      const clientExistant = await prisma.client.findUnique({
        where: { telephone: value }
      });
      if (clientExistant) {
        throw new Error("Ce numéro de téléphone est déjà utilisé.");
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

const mettreAjourClientValidator = [
  param("id")
    .notEmpty()
    .withMessage("L'id est obligatoire.")
    .bail()
    .custom(async value => {
      const client = await prisma.client.findUnique({
        where: { id: parseInt(value) }
      });
      if (!client) {
        throw new Error("Le client n'existe pas.");
      }
      return true;
    }),

  check("nom")
    .optional()
    .isLength({ min: 2 })
    .withMessage("Le nom doit contenir au moins 2 caractères.")
    .bail()
    .matches(/^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/)
    .withMessage(
      "Le nom doit contenir uniquement des lettres et des caractères spéciaux autorisés."
    )
    .bail(),

  check("prenom")
    .optional()
    .isLength({ min: 2 })
    .withMessage("Le prénom doit contenir au moins 2 caractères.")
    .bail()
    .matches(/^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/)
    .withMessage(
      "Le prénom doit contenir uniquement des lettres et des caractères spéciaux autorisés."
    )
    .bail(),

  check("telephone")
    .optional()
    .matches(/^[0-9]+$/)
    .withMessage(
      "Le numéro de téléphone doit contenir uniquement des chiffres."
    )
    .bail()
    .isLength({ min: 8, max: 15 })
    .withMessage("Le numéro de téléphone doit contenir entre 8 et 15 chiffres.")
    .bail()
    .custom(async (value, { req }) => {
      const clientExistant = await prisma.client.findUnique({
        where: { telephone: value }
      });
      if (clientExistant && clientExistant.id !== parseInt(req.params.id)) {
        throw new Error("Ce numéro de téléphone est déjà utilisé.");
      }
      return true;
    }),

  check("utilisateurId")
    .optional()
    .isInt({ min: 1 })
    .withMessage("L'ID de l'utilisateur doit être un entier positif.")
    .bail()
    .custom(async value => {
      const utilisateur = await prisma.utilisateur.findUnique({
        where: { id: value }
      });
      if (!utilisateur) {
        throw new Error("L'utilisateur sélectionné n'existe pas.");
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

const supprimerClientValidator = [
  param("id")
    .notEmpty()
    .withMessage("L'id est obligatoire.")
    .bail()
    .custom(async value => {
      const utilisateur = await prisma.client.findUnique({
        where: { id: parseInt(value) }
      });
      if (!utilisateur) {
        throw new Error("Le client n'existe pas.");
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
  creerClientValidator,
  mettreAjourClientValidator,
  supprimerClientValidator
};
