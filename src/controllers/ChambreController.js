import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class ChambreController {
  static async creerChambre(req, res) {
    try {
      const { numeroChambre, prix, typeId, utilisateurId } = req.body;

      const chambreExistant = await prisma.chambre.findUnique({
        where: { numeroChambre }
      });

      if (chambreExistant) {
        return res
          .status(400)
          .json({ message: "Le  numéro du chambre est déjà utilisé" });
      }

      const typeExiste = await prisma.typeChambre.findUnique({
        where: { id: typeId }
      });

      if (!typeExiste) {
        return res
          .status(404)
          .json({ message: "Le type de chambre n'existe pas" });
      }

      const utilisateurExiste = await prisma.utilisateur.findUnique({
        where: { id: utilisateurId }
      });

      if (!utilisateurExiste) {
        return res.status(404).json({ message: "L'utilisateur n'existe pas" });
      }

      const nouvelleChambre = await prisma.chambre.create({
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
  }

  static async getChambres(req, res) {
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
  }

  static async getChambreById(req, res) {
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
  }

  static async mettreAJourChambre(req, res) {
    const { id } = req.params;
    const { numeroChambre, prix, typeId, utilisateurId } = req.body;
    try {
      const chambre = await prisma.chambre.findUnique({
        where: { id: parseInt(id) }
      });

      if (!chambre) {
        return res.status(404).json({ message: "Chambre non trouvé" });
      }
      const chambreExistant = await prisma.chambre.findUnique({
        where: { numeroChambre }
      });

      if (chambreExistant) {
        return res.status(400).json({ message: "Cet numéro est déjà utilisé" });
      }

      const typeExiste = await prisma.typeChambre.findUnique({
        where: { id: typeId }
      });

      if (!typeExiste) {
        return res
          .status(404)
          .json({ message: "Le type de chambre n'existe pas" });
      }

      const utilisateurExiste = await prisma.utilisateur.findUnique({
        where: { id: utilisateurId }
      });

      if (!utilisateurExiste) {
        return res.status(404).json({ message: "L'utilisateur n'existe pas" });
      }

      const chambreMisAJour = await prisma.chambre.update({
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
  }

  static async supprimerChambre(req, res) {
    const { id } = req.params;
    try {
      const chambre = await prisma.chambre.findUnique({
        where: { id: parseInt(id) }
      });

      if (!chambre) {
        return res.status(404).json({ message: "Chambre non trouvé" });
      }
      await prisma.chambre.delete({
        where: { id: parseInt(id) }
      });
      return res.json({ message: "Chambre supprimer avec sucess" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: "Erreur lors de la suppression de la chambre",
        error
      });
    }
  }
}

export default ChambreController;
