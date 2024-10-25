import { check, param, validationResult } from "express-validator";
import prisma from "../config/prisma.js";
import { StatusCodes } from "http-status-codes";

const creerUtilisateurValidator = [
  check("nom")
    .notEmpty()
    .withMessage((_value, { req }) => req.t("validator.nom.required"))
    .bail()
    .matches(/^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/)
    .withMessage((_value, { req }) => req.t("validator.nom.invalid"))
    .bail()
    .isLength({ min: 3 })
    .withMessage((_value, { req }) => req.t("validator.nom.minLength"))
    .bail(),

  check("email")
    .notEmpty()
    .withMessage((_value, { req }) => req.t("validator.email.required"))
    .bail()
    .isEmail()
    .withMessage((_value, { req }) => req.t("validator.email.invalid"))
    .bail()
    .custom(async (value, { req }) => {
      const utilisateurExistant = await prisma.utilisateur.findUnique({
        where: { email: value }
      });
      if (utilisateurExistant) {
        throw new Error(req.t("validator.email.alreadyUsed"));
      }
      return true;
    }),

  check("password")
    .notEmpty()
    .withMessage((_value, { req }) => req.t("validator.password.required"))
    .bail()
    .isLength({ min: 4 })
    .withMessage((_value, { req }) => req.t("validator.password.minLength"))
    .bail(),

  check("role")
    .notEmpty()
    .withMessage((_value, { req }) => req.t("validator.role.required"))
    .bail()
    .isIn(["ADMIN", "GESTIONNAIRE"])
    .withMessage((_value, { req }) => req.t("validator.role.invalid"))
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
    .withMessage((_value, { req }) => req.t("validator.id.required"))
    .bail()
    .custom(async (value, { req }) => {
      const utilisateur = await prisma.utilisateur.findUnique({
        where: { id: parseInt(value) }
      });
      if (!utilisateur) {
        throw new Error(req.t("validator.user.notFound"));
      }
      return true;
    }),

  check("nom")
    .optional()
    .isLength({ min: 3 })
    .withMessage((_value, { req }) => req.t("validator.nom.minLength"))
    .bail()
    .matches(/^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/)
    .withMessage((_value, { req }) => req.t("validator.nom.invalid"))
    .bail(),

  check("email")
    .optional()
    .isEmail()
    .withMessage((_value, { req }) => req.t("validator.email.invalid"))
    .bail()
    .custom(async (value, { req }) => {
      const utilisateurExistant = await prisma.utilisateur.findUnique({
        where: { email: value }
      });
      if (
        utilisateurExistant &&
        utilisateurExistant.id !== parseInt(req.params.id)
      ) {
        throw new Error(req.t("validator.email.alreadyUsed"));
      }
      return true;
    }),

  check("password")
    .optional()
    .isLength({ min: 4 })
    .withMessage((_value, { req }) => req.t("validator.password.minLength"))
    .bail(),

  check("role")
    .optional()
    .isIn(["ADMIN", "GESTIONNAIRE"])
    .withMessage((_value, { req }) => req.t("validator.role.invalid"))
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
    .withMessage((_value, { req }) => req.t("validator.id.required"))
    .bail()
    .custom(async (value, { req }) => {
      const utilisateur = await prisma.utilisateur.findUnique({
        where: { id: parseInt(value) }
      });
      if (!utilisateur) {
        throw new Error(req.t("validator.user.notFound"));
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
