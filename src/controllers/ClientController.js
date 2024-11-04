import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import i18next from "../i18nextConfig.js";

export const creerClient = async (req, res) => {
  try {
    const { nom, prenom, telephone } = req.body;
    const utilisateurId = req.utilisateur.utilisateurId;

    const telephoneExistant = await prisma.client.findUnique({
      where: { telephone }
    });

    if (telephoneExistant) {
      return res
        .status(400)
        .json({ message: i18next.t("client.telephoneUsed") });
    }

    await prisma.client.create({
      data: {
        nom,
        prenom,
        telephone,
        utilisateurId
      }
    });

    return res.status(201).json({ message: i18next.t("client.addSuccess") });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: i18next.t("client.createError"), error });
  }
};

export const afficherClients = async (req, res) => {
  try {
    const clients = await prisma.client.findMany({
      include: {
        utilisateur: false,
        reservations: false
      }
    });
    return res.status(200).json(clients);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: i18next.t("client.fetchError"), error });
  }
};

export const afficherClientParId = async (req, res) => {
  const { id } = req.params;
  try {
    const client = await prisma.client.findUnique({
      where: { id: parseInt(id) },
      include: {
        utilisateur: { select: { nom: true } },
        reservations: true
      }
    });

    if (!client) {
      return res.status(404).json({ message: i18next.t("client.notFound") });
    }

    return res.status(200).json(client);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: i18next.t("client.fetchError"), error });
  }
};

export const mettreAJourClient = async (req, res) => {
  const { id } = req.params;
  const { nom, prenom, telephone } = req.body;
  const utilisateurId = req.utilisateur.utilisateurId;

  try {
    const clientExistant = await prisma.client.findUnique({
      where: { id: parseInt(id) }
    });

    if (!clientExistant) {
      return res.status(404).json({ message: i18next.t("client.notFound") });
    }

    const telephoneExistant = await prisma.client.findUnique({
      where: { telephone }
    });

    if (telephoneExistant && telephoneExistant.id !== parseInt(id)) {
      return res
        .status(400)
        .json({ message: i18next.t("client.telephoneUsed") });
    }

    await prisma.client.update({
      where: { id: parseInt(id) },
      data: {
        nom,
        prenom,
        telephone,
        utilisateurId
      }
    });

    return res.json({ message: i18next.t("client.updateSuccess") });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: req.t("client.updateError"), error });
  }
};

export const supprimerClient = async (req, res) => {
  const { id } = req.params;

  try {
    const client = await prisma.client.findUnique({
      where: { id: parseInt(id) }
    });

    if (!client) {
      return res.status(404).json({ message: i18next.t("client.notFound") });
    }

    const clientReservation = await prisma.reservation.findFirst({
      where: { clientId: parseInt(id) }
    });

    if (clientReservation) {
      return res
        .status(400)
        .json({ message: i18next.t("client.hasReservation") });
    }
    await prisma.client.delete({
      where: { id: parseInt(id) }
    });

    return res.json({ message: i18next.t("client.deleteSuccess") });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: i18next.t("client.deleteError"), error });
  }
};
