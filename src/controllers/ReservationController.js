import { PrismaClient } from "@prisma/client";
import { jsPDF } from "jspdf";
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
export const afficherChambresDisponibles = async (req, res) => {
  try {
    const chambresDisponibles = await prisma.chambre.findMany({
      where: {
        reservations: {
          none: {
            OR: [
              {
                dateDebut: { lte: new Date() },
                dateFin: { gte: new Date() }
              }
            ]
          }
        }
      },
      include: {
        type: true,
        utilisateur: { select: { nom: true } }
      }
    });

    return res.status(200).json(chambresDisponibles);
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des chambres disponibles :",
      error
    );
    return res.status(500).json({
      message: i18next.t("chambre.erreurRecuperationChambresDisponibles"),
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
    const parsedDateDebut = dateDebut
      ? new Date(dateDebut)
      : reservation.dateDebut;
    const parsedDateFin = dateFin ? new Date(dateFin) : reservation.dateFin;

    if (isNaN(parsedDateDebut) || isNaN(parsedDateFin)) {
      return res
        .status(400)
        .json({ message: "Les dates fournies sont invalides." });
    }
    if (chambreId) {
      const chambre = await prisma.chambre.findUnique({
        where: { id: chambreId }
      });
      if (!chambre) {
        return res
          .status(404)
          .json({ message: i18next.t("reservation.chambreNotFound") });
      }
    }
    if (clientId) {
      const client = await prisma.client.findUnique({
        where: { id: clientId }
      });
      if (!client) {
        return res
          .status(404)
          .json({ message: i18next.t("reservation.clientNotFound") });
      }
    }

    await prisma.reservation.update({
      where: { id: parseInt(id) },
      data: {
        dateDebut: parsedDateDebut,
        dateFin: parsedDateFin,
        chambreId: chambreId || reservation.chambreId,
        clientId: clientId || reservation.clientId,
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

export const telechargerRecuReservation = async (req, res) => {
  const { id } = req.params;

  try {
    const reservation = await prisma.reservation.findUnique({
      where: { id: parseInt(id) },
      include: {
        chambre: { select: { numeroChambre: true } },
        client: { select: { nom: true, prenom: true, telephone: true } },
        utilisateur: { select: { nom: true } }
      }
    });

    if (!reservation) {
      return res.status(404).json({ message: "Réservation introuvable" });
    }

    res.status(200).json({
      id: reservation.id,
      client: reservation.client,
      chambre: reservation.chambre,
      utilisateur: reservation.utilisateur,
      dateDebut: reservation.dateDebut,
      dateFin: reservation.dateFin,
      status: reservation.status
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des données :", error);
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération des données." });
  }
};
