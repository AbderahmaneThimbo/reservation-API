import { PrismaClient } from "@prisma/client";
import i18next from "../i18nextConfig.js";

const prisma = new PrismaClient();

export const creerTypeChambre = async (req, res) => {
  try {
    const { nom } = req.body;
    const utilisateurId = req.utilisateur.utilisateurId;

    const nomExistant = await prisma.typeChambre.findUnique({
      where: { nom }
    });

    if (nomExistant) {
      return res
        .status(400)
        .json({ message: i18next.t("typeChambre.nameAlreadyExists") });
    }

    await prisma.typeChambre.create({
      data: { nom, utilisateurId }
    });

    res
      .status(201)
      .json({ message: i18next.t("typeChambre.addedSuccessfully") });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: i18next.t("error.creationTypeChambreError"),
      error
    });
  }
};

export const afficherTypeChambres = async (req, res) => {
  try {
    const typesChambres = await prisma.typeChambre.findMany({
      include: {
        utilisateur: false
      }
    });
    return res.status(200).json(typesChambres);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: i18next.t("error.fetchingTypesChambresError"),
      error
    });
  }
};

export const afficherTypeChambreParId = async (req, res) => {
  const { id } = req.params;
  try {
    const typeChambre = await prisma.typeChambre.findUnique({
      where: { id: parseInt(id) },
      include: {
        utilisateur: { select: { nom: true } }
      }
    });

    if (!typeChambre) {
      return res
        .status(404)
        .json({ message: i18next.t("typeChambre.notFound") });
    }

    return res.status(200).json(typeChambre);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: i18next.t("error.fetchingTypeChambreError"),
      error
    });
  }
};

export const afficherChambresByTypeChambre = async (req, res) => {
  const { id } = req.params;
  try {
    const typeChambre = await prisma.typeChambre.findUnique({
      where: { id: parseInt(id) }
    });

    if (!typeChambre) {
      return res
        .status(404)
        .json({ message: i18next.t("typeChambre.notFound") });
    }

    const chambres = await prisma.chambre.findMany({
      where: { typeId: parseInt(id) }
    });

    if (chambres.length === 0) {
      return res
        .status(404)
        .json({ message: i18next.t("chambre.noChambresForType") });
    }

    return res.status(200).json(chambres);
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des chambres liées au type de chambre :",
      error
    );
    return res.status(500).json({
      message: i18next.t("chambre.errorFetchingChambres"),
      error
    });
  }
};

export const mettreAJourTypeChambre = async (req, res) => {
  const { id } = req.params;
  const { nom } = req.body;
  const utilisateurId = req.utilisateur.utilisateurId;
  try {
    const typeExistant = await prisma.typeChambre.findUnique({
      where: { id: parseInt(id) }
    });

    if (!typeExistant) {
      return res
        .status(404)
        .json({ message: i18next.t("typeChambre.notFound") });
    }

    await prisma.typeChambre.update({
      where: { id: parseInt(id) },
      data: { nom, utilisateurId }
    });

    return res.json({ message: i18next.t("typeChambre.updatedSuccessfully") });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: i18next.t("error.updatingTypeChambreError"),
      error
    });
  }
};

export const supprimerTypeChambre = async (req, res) => {
  const { id } = req.params;
  try {
    const typeChambre = await prisma.typeChambre.findUnique({
      where: { id: parseInt(id) }
    });

    if (!typeChambre) {
      return res
        .status(404)
        .json({ message: i18next.t("typeChambre.notFound") });
    }
    const chambresUtilisantType = await prisma.chambre.findFirst({
      where: { typeId: parseInt(id) }
    });

    if (chambresUtilisantType) {
      return res
        .status(400)
        .json({ message: i18next.t("typeChambre.typeInUse"), warning: true });
    }

    await prisma.typeChambre.delete({
      where: { id: parseInt(id) }
    });

    return res.json({ message: i18next.t("typeChambre.deletedSuccessfully") });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: i18next.t("error.deletingTypeChambreError"),
      error
    });
  }
};
