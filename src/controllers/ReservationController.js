import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const creerReservation = async (req, res) => {
  try {
    const { dateDebut, dateFin, chambreId, clientId } = req.body;

    const utilisateurId = req.utilisateur.utilisateurId;

    const chambre = await prisma.chambre.findUnique({
      where: { id: chambreId }
    });
    if (!chambre) {
      return res.status(404).json({ message: "La chambre n'existe pas" });
    }

    const client = await prisma.client.findUnique({
      where: { id: clientId }
    });
    if (!client) {
      return res.status(404).json({ message: "Le client n'existe pas" });
    }

    await prisma.reservation.create({
      data: {
        dateDebut: new Date(dateDebut),
        dateFin: new Date(dateFin),
        chambreId,
        clientId,
        utilisateurId
      }
    });

    res.status(201).json({ message: "Réservation ajoutée avec succès" });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Erreur lors de la création de la réservation",
      error
    });
  }
};

export const afficherReservations = async (req, res) => {
  try {
    const reservations = await prisma.reservation.findMany({
      include: {
        chambre: false,
        client: false,
        utilisateur: false
      }
    });
    res.status(200).json(reservations);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Erreur lors de la récupération des réservations",
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
        utilisateur: true
      }
    });
    if (!reservation) {
      return res.status(404).json({ message: "Réservation non trouvée" });
    }
    res.status(200).json(reservation);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Erreur lors de la récupération de la réservation",
      error
    });
  }
};

export const mettreAJourReservation = async (req, res) => {
  const { id } = req.params;
  const { dateDebut, dateFin, chambreId, clientId } = req.body;
  const utilisateurId = req.utilisateur.utilisateurId;
  try {
    const reservation = await prisma.reservation.findUnique({
      where: { id: parseInt(id) }
    });
    if (!reservation) {
      return res.status(404).json({ message: "Réservation non trouvée" });
    }

    const chambre = await prisma.chambre.findUnique({
      where: { id: chambreId }
    });
    if (!chambre) {
      return res.status(404).json({ message: "La chambre n'existe pas" });
    }

    const client = await prisma.client.findUnique({
      where: { id: clientId }
    });
    if (!client) {
      return res.status(404).json({ message: "Le client n'existe pas" });
    }

    await prisma.reservation.update({
      where: { id: parseInt(id) },
      data: {
        dateDebut: new Date(dateDebut),
        dateFin: new Date(dateFin),
        chambreId,
        clientId,
        utilisateurId
      }
    });

    res.json({ message: "Réservation mise à jour avec succès" });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Erreur lors de la mise à jour de la réservation",
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
      return res.status(404).json({ message: "Réservation non trouvée" });
    }

    await prisma.reservation.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: "Réservation supprimée avec succès" });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Erreur lors de la suppression de la réservation",
      error
    });
  }
};
