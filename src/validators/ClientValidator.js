import { check, param, validationResult } from "express-validator";
import prisma from "../config/prisma.js";
import { StatusCodes } from "http-status-codes";

export const creerClientValidator = [
  check("nom")
    .notEmpty()
    .withMessage((_, { req }) => req.t("validator.nomRequired"))
    .bail()
    .matches(/^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/)
    .withMessage((_, { req }) => req.t("validator.invalidName"))
    .bail()
    .isLength({ min: 2 })
    .withMessage((_, { req }) => req.t("validator.minLength", { min: 2 }))
    .bail(),

  check("prenom")
    .notEmpty()
    .withMessage((_, { req }) => req.t("validator.prenomRequired"))
    .bail()
    .matches(/^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/)
    .withMessage((_, { req }) => req.t("validator.invalidPrenom"))
    .bail()
    .isLength({ min: 2 })
    .withMessage((_, { req }) => req.t("validator.minLength", { min: 2 }))
    .bail(),

  check("telephone")
    .notEmpty()
    .withMessage((_, { req }) => req.t("validator.telephoneRequired"))
    .bail()
    .matches(/^[0-9]+$/)
    .withMessage((_, { req }) => req.t("validator.invalidTelephone"))
    .bail()
    .isLength({ min: 8, max: 15 })
    .withMessage((_value, { req }) => req.t("validator.telephoneLength"))
    .bail()
    .custom(async (value, { req }) => {
      const clientExistant = await prisma.client.findUnique({
        where: { telephone: value }
      });
      if (clientExistant) {
        throw new Error(req.t("validator.telephoneExists"));
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

export const mettreAjourClientValidator = [
  param("id")
    .notEmpty()
    .withMessage((_, { req }) => req.t("validator.idRequired"))
    .bail()
    .custom(async (value, { req }) => {
      const client = await prisma.client.findUnique({
        where: { id: parseInt(value) }
      });
      if (!client) {
        throw new Error(req.t("validator.notFound"));
      }
      return true;
    }),

  check("nom")
    .optional()
    .isLength({ min: 2 })
    .withMessage((_, { req }) => req.t("validator.minLength", { min: 2 }))
    .bail()
    .matches(/^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/)
    .withMessage((_, { req }) => req.t("validator.invalidName"))
    .bail(),

  check("prenom")
    .optional()
    .isLength({ min: 2 })
    .withMessage((_, { req }) => req.t("validator.minLength", { min: 2 }))
    .bail()
    .matches(/^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/)
    .withMessage((_, { req }) => req.t("validator.invalidPrenom"))
    .bail(),

  check("telephone")
    .optional()
    .matches(/^[0-9]+$/)
    .withMessage((_, { req }) => req.t("validator.invalidTelephone"))
    .bail()
    .isLength({ min: 8, max: 15 })
    .withMessage((_, { req }) => req.t("validator.telephoneLength"))
    .bail()
    .custom(async (value, { req }) => {
      const clientExistant = await prisma.client.findUnique({
        where: { telephone: value }
      });
      if (clientExistant && clientExistant.id !== parseInt(req.params.id)) {
        throw new Error(req.t("validator.telephoneExists"));
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

export const supprimerClientValidator = [
  param("id")
    .notEmpty()
    .withMessage((_, { req }) => req.t("validator.idRequired"))
    .bail()
    .custom(async (value, { req }) => {
      const utilisateur = await prisma.client.findUnique({
        where: { id: parseInt(value) }
      });
      if (!utilisateur) {
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
