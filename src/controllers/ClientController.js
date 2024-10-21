import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class ClientController {
  static async creerClient(req, res) {
    try {
      const { nom, prenom, telephone, utilisateurId } = req.body;

      const telephoneExistant = await prisma.client.findUnique({
        where: { telephone }
      });

      if (telephoneExistant) {
        return res
          .status(400)
          .json({ message: "Le numéro du telephone est déjà utilisé" });
      }

      const utilisateurExiste = await prisma.utilisateur.findUnique({
        where: { id: utilisateurId }
      });
      if (!utilisateurExiste) {
        return res.status(404).json({ message: "L'utilisateur n'existe pas" });
      }

      const nouveauClient = await prisma.client.create({
        data: {
          nom,
          prenom,
          telephone,
          utilisateurId
        }
      });

      return res.status(201).json({ message: "Client ajoutée avec succès" });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: "Erreur lors de la création du client", error });
    }
  }

  static async getClients(req, res) {
    try {
      const clients = await prisma.client.findMany({
        include: {
          utilisateur: true,
          reservations: true
        }
      });

      return res.status(200).json(clients);
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: "Erreur lors de la récupération des clients", error });
    }
  }

  static async getClientById(req, res) {
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
  }

  static async mettreAJourClient(req, res) {
    const { id } = req.params;
    const { nom, prenom, telephone, utilisateurId } = req.body;
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

      if (telephoneExistant) {
        return res
          .status(400)
          .json({ message: "Le numéro du telephone est déjà utilisé" });
      }

      const utilisateurExiste = await prisma.utilisateur.findUnique({
        where: { id: utilisateurId }
      });
      if (!utilisateurExiste) {
        return res.status(404).json({ message: "L'utilisateur n'existe pas" });
      }

      const clientMisAJour = await prisma.client.update({
        where: { id: parseInt(id) },
        data: { nom, prenom, telephone, utilisateurId }
      });

      return res.json({ message: "Client mise à jour avec succès" });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: "Erreur lors de la mise à jour du client", error });
    }
  }

  static async supprimerClient(req, res) {
    const { id } = req.params;
    try {
      const client = await prisma.client.findUnique({
        where: { id: parseInt(id) }
      });

      if (!client) {
        return res.status(404).json({ message: "Client non trouvé" });
      }

      await prisma.client.delete({
        where: { id: parseInt(id) }
      });

      res.json({ message: "client supprimer avec sucess" });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: "Erreur lors de la suppression du client", error });
    }
  }
}

export default ClientController;
