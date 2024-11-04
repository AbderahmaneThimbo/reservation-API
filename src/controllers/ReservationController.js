import { PrismaClient } from "@prisma/client";
import i18next from "../i18nextConfig.js";

const prisma = new PrismaClient();

export const creerReservation = async (req, res) => {
  try {
    const { dateDebut, dateFin, status, chambreId, clientId } = req.body;
    const utilisateurId = req.utilisateur.utilisateurId;

    const chambre = await prisma.chambre.findUnique({
      where: { id: chambreId }
    });
    if (!chambre) {
      return res
        .status(404)
        .json({ message: i18next.t("reservation.chambreNotFound") });
    }

    const client = await prisma.client.findUnique({
      where: { id: clientId }
    });
    if (!client) {
      return res
        .status(404)
        .json({ message: i18next.t("reservation.clientNotFound") });
    }

    await prisma.reservation.create({
      data: {
        dateDebut: new Date(dateDebut),
        dateFin: new Date(dateFin),
        status,
        chambreId,
        clientId,
        utilisateurId
      }
    });

    res
      .status(201)
      .json({ message: i18next.t("reservation.reservationCreated") });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: i18next.t("reservation.reservationCreationError"),
      error
    });
  }
};

export const afficherReservations = async (req, res) => {
  try {
    const reservations = await prisma.reservation.findMany({
      include: {
        chambre: true,
        client: true,
        utilisateur: false
      }
    });
    res.status(200).json(reservations);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: i18next.t("reservation.reservationFetchError"),
      error
    });
  }
};

export const afficherReservationParId = async (req, res) => {
  const { id } = req.params;
  try {
    const reservation = await prisma.reservation.findUnique({
      where: { id: parseInt(id) },
      include: {
        chambre: true,
        client: true,
        utilisateur: { select: { nom: true } }
      }
    });
    if (!reservation) {
      return res
        .status(404)
        .json({ message: i18next.t("reservation.reservationNotFound") });
    }
    res.status(200).json(reservation);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: i18next.t("reservation.reservationFetchError"),
      error
    });
  }
};

export const mettreAJourReservation = async (req, res) => {
  const { id } = req.params;
  const { dateDebut, dateFin, status, chambreId, clientId } = req.body;
  const utilisateurId = req.utilisateur.utilisateurId;

  try {
    const reservation = await prisma.reservation.findUnique({
      where: { id: parseInt(id) }
    });
    if (!reservation) {
      return res
        .status(404)
        .json({ message: i18next.t("reservation.reservationNotFound") });
    }

    const chambre = await prisma.chambre.findUnique({
      where: { id: chambreId }
    });
    if (!chambre) {
      return res
        .status(404)
        .json({ message: i18next.t("reservation.chambreNotFound") });
    }

    const client = await prisma.client.findUnique({
      where: { id: clientId }
    });
    if (!client) {
      return res
        .status(404)
        .json({ message: i18next.t("reservation.clientNotFound") });
    }

    await prisma.reservation.update({
      where: { id: parseInt(id) },
      data: {
        dateDebut: new Date(dateDebut),
        dateFin: new Date(dateFin),
        chambreId,
        clientId,
        utilisateurId,
        status
      }
    });

    res.json({ message: i18next.t("reservation.reservationUpdated") });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: i18next.t("reservation.reservationUpdateError"),
      error
    });
  }
};

export const supprimerReservation = async (req, res) => {
  const { id } = req.params;
  try {
    const reservation = await prisma.reservation.findUnique({
      where: { id: parseInt(id) }
    });
    if (!reservation) {
      return res
        .status(404)
        .json({ message: i18next.t("reservation.reservationNotFound") });
    }

    await prisma.reservation.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: i18next.t("reservation.reservationDeleted") });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: i18next.t("reservation.reservationDeleteError"),
      error
    });
  }
};
