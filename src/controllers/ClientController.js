import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

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
        .json({ message: "Le numéro de téléphone est déjà utilisé" });
    }

    await prisma.client.create({
      data: {
        nom,
        prenom,
        telephone,
        utilisateurId
      }
    });

    return res.status(201).json({ message: "Client ajouté avec succès" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Erreur lors de la création du client", error });
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
      .json({ message: "Erreur lors de la récupération des clients", error });
  }
};

export const afficherClientParId = async (req, res) => {
  const { id } = req.params;
  try {
    const client = await prisma.client.findUnique({
      where: { id: parseInt(id) },
      include: {
        utilisateur: true,
        reservations: true
      }
    });

    if (!client) {
      return res.status(404).json({ message: "Client non trouvé" });
    }

    return res.status(200).json(client);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Erreur lors de la récupération du client", error });
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
      return res.status(404).json({ message: "Client non trouvé" });
    }

    const telephoneExistant = await prisma.client.findUnique({
      where: { telephone }
    });

    if (telephoneExistant && telephoneExistant.id !== parseInt(id)) {
      return res
        .status(400)
        .json({ message: "Le numéro de téléphone est déjà utilisé" });
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

    return res.json({ message: "Client mis à jour avec succès" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Erreur lors de la mise à jour du client", error });
  }
};

export const supprimerClient = async (req, res) => {
  const { id } = req.params;

  try {
    const client = await prisma.client.findUnique({
      where: { id: parseInt(id) }
    });

    if (!client) {
      return res.status(404).json({ message: "Client non trouvé" });
    }

    const clientReservation = await prisma.reservation.findFirst({
      where: { clientId: parseInt(id) }
    });

    if (clientReservation) {
      return res.status(400).json({ message: "Ce client à une réservation" });
    }
    await prisma.client.delete({
      where: { id: parseInt(id) }
    });

    return res.json({ message: "Client supprimé avec succès" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Erreur lors de la suppression du client", error });
  }
};
