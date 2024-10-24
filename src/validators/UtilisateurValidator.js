import { check, param, validationResult } from "express-validator";
import prisma from "../config/prisma.js";
import { StatusCodes } from "http-status-codes";

const creerUtilisateurValidator = [
  check("nom")
    .notEmpty()
    .withMessage("Le nom est obligatoire.")
    .bail()
    .matches(/^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/)
    .withMessage(
      "Le nom doit contenir uniquement des lettres et des caractères spéciaux autorisés."
    )
    .bail()
    .isLength({ min: 3 })
    .withMessage("Le nom doit contenir au moins 3 caractères.")
    .bail(),

  check("email")
    .notEmpty()
    .withMessage("L'email est obligatoire.")
    .bail()
    .isEmail()
    .withMessage("L'email doit être valide.")
    .bail()
    .custom(async value => {
      const utilisateurExistant = await prisma.utilisateur.findUnique({
        where: { email: value }
      });
      if (utilisateurExistant) {
        throw new Error("Cet email est déjà utilisé.");
      }
      return true;
    }),

  check("password")
    .notEmpty()
    .withMessage("Le mot de passe est obligatoire.")
    .bail()
    .isLength({ min: 4 })
    .withMessage("Le mot de passe doit contenir au moins 4 caractères.")
    .bail(),

  check("role")
    .notEmpty()
    .withMessage("Le rôle est obligatoire.")
    .bail()
    .isIn(["ADMIN", "GESTIONNAIRE"])
    .withMessage('Le rôle doit être "ADMIN" ou "GESTIONNAIRE".')
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

const mettreAjourUtilisateurValidator = [
  param("id")
    .notEmpty()
    .withMessage("L'id est obligatoire.")
    .bail()
    .custom(async value => {
      const utilisateur = await prisma.utilisateur.findUnique({
        where: { id: parseInt(value) }
      });
      if (!utilisateur) {
        throw new Error("L'utilisateur n'existe pas.");
      }
      return true;
    }),

  check("nom")
    .optional()
    .isLength({ min: 3 })
    .withMessage("Le nom doit contenir au moins 3 caractères.")
    .bail()
    .matches(/^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/)
    .withMessage(
      "Le nom doit contenir uniquement des lettres et des caractères spéciaux autorisés."
    )
    .bail(),

  check("email")
    .optional()
    .isEmail()
    .withMessage("L'email doit être valide.")
    .bail()
    .custom(async (value, { req }) => {
      const utilisateurExistant = await prisma.utilisateur.findUnique({
        where: { email: value }
      });
      if (
        utilisateurExistant &&
        utilisateurExistant.id !== parseInt(req.params.id)
      ) {
        throw new Error("Cet email est déjà utilisé.");
      }
      return true;
    }),

  check("password")
    .optional()
    .isLength({ min: 4 })
    .withMessage("Le mot de passe doit contenir au moins 4 caractères.")
    .bail(),

  check("role")
    .optional()
    .isIn(["ADMIN", "GESTIONNAIRE"])
    .withMessage('Le rôle doit être "ADMIN" ou "GESTIONNAIRE".')
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

const supprimerUtilisateurValidator = [
  param("id")
    .notEmpty()
    .withMessage("L'id est obligatoire.")
    .bail()
    .custom(async value => {
      const utilisateur = await prisma.utilisateur.findUnique({
        where: { id: parseInt(value) }
      });
      if (!utilisateur) {
        throw new Error("L'utilisateur n'existe pas.");
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
  creerUtilisateurValidator,
  mettreAjourUtilisateurValidator,
  supprimerUtilisateurValidator
};
