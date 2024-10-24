import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const creerChambre = async (req, res) => {
  try {
    const { numeroChambre, prix, typeId } = req.body;
    const utilisateurId = req.utilisateur.utilisateurId;
    const chambreExistant = await prisma.chambre.findUnique({
      where: { numeroChambre }
    });

    if (chambreExistant) {
      return res
        .status(400)
        .json({ message: "Le numéro de chambre est déjà utilisé" });
    }

    const typeExiste = await prisma.typeChambre.findUnique({
      where: { id: typeId }
    });

    if (!typeExiste) {
      return res
        .status(404)
        .json({ message: "Le type de chambre n'existe pas" });
    }

    await prisma.chambre.create({
      data: {
        numeroChambre,
        prix,
        typeId,
        utilisateurId
      }
    });

    return res.status(201).json({ message: "Chambre ajoutée avec succès" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Erreur lors de la création de la chambre",
      error
    });
  }
};

export const afficherChambres = async (req, res) => {
  try {
    const chambres = await prisma.chambre.findMany();
    return res.status(200).json(chambres);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Erreur lors de la récupération des chambres",
      error
    });
  }
};

export const afficherChambreParId = async (req, res) => {
  const { id } = req.params;
  try {
    const chambre = await prisma.chambre.findUnique({
      where: { id: parseInt(id) }
    });
    if (!chambre) {
      return res.status(404).json({ message: "Chambre non trouvée" });
    }
    return res.status(200).json(chambre);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Erreur lors de la récupération de la chambre",
      error
    });
  }
};

export const mettreAJourChambre = async (req, res) => {
  const { id } = req.params;
  const { numeroChambre, prix, typeId } = req.body;
  const utilisateurId = req.utilisateur.utilisateurId;
  try {
    const chambre = await prisma.chambre.findUnique({
      where: { id: parseInt(id) }
    });
    if (!chambre) {
      return res.status(404).json({ message: "Chambre non trouvée" });
    }

    if (numeroChambre && numeroChambre !== chambre.numeroChambre) {
      const chambreExistant = await prisma.chambre.findUnique({
        where: { numeroChambre }
      });
      if (chambreExistant) {
        return res.status(400).json({ message: "Ce numéro est déjà utilisé" });
      }
    }

    const typeExiste = await prisma.typeChambre.findUnique({
      where: { id: typeId }
    });
    if (!typeExiste) {
      return res
        .status(404)
        .json({ message: "Le type de chambre n'existe pas" });
    }

    await prisma.chambre.update({
      where: { id: parseInt(id) },
      data: {
        numeroChambre,
        prix,
        typeId,
        utilisateurId
      }
    });

    return res.json({ message: "Chambre mise à jour avec succès" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Erreur lors de la mise à jour de la chambre",
      error
    });
  }
};

export const supprimerChambre = async (req, res) => {
  const { id } = req.params;
  try {
    const chambre = await prisma.chambre.findUnique({
      where: { id: parseInt(id) }
    });
    if (!chambre) {
      return res.status(404).json({ message: "Chambre non trouvée" });
    }

    const chambreReservtion = await prisma.reservation.findFirst({
      where: { chambreId: parseInt(id) }
    });

    if (chambreReservtion) {
      return res
        .status(400)
        .json({ message: "Cette chambre à une réservation" });
    }

    await prisma.chambre.delete({
      where: { id: parseInt(id) }
    });

    return res.json({ message: "Chambre supprimée avec succès" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Erreur lors de la suppression de la chambre",
      error
    });
  }
};
