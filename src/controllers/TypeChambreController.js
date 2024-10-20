import prisma from "../config/prisma.js";

class TypeChambreController {
  static async creerTypeChambre(req, res) {
    const { type } = req.body;
    try {
      const nouveauTypeChambre = await prisma.typeChambre.create({
        data: {
          type
        }
      });
      res.status(201).json({ message: "Type de chambre ajoutée avec succès" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: "Erreur lors de la création du type de chambre",
        error
      });
    }
  }

  static async getTypeChambres(req, res) {
    try {
      const typesChambres = await prisma.typeChambre.findMany();
      return res.status(200).json(typesChambres);
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: "Erreur lors de la récupération des types de chambres",
        error
      });
    }
  }

  static async getTypeChambreById(req, res) {
    const { id } = req.params;
    try {
      const typeChambre = await prisma.typeChambre.findUnique({
        where: { id: parseInt(id) }
      });

      if (!typeChambre) {
        return res.status(404).json({ message: "Type de chambre non trouvé" });
      }

      return res.status(200).json(typeChambre);
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: "Erreur lors de la récupération du type de chambre",
        error
      });
    }
  }

  static async mettreAJourTypeChambre(req, res) {
    const { id } = req.params;
    const { type } = req.body;
    try {
      const typeChambreMisAJour = await prisma.typeChambre.update({
        where: { id: parseInt(id) },
        data: { type }
      });
      res.json({ message: "Type dde chambre mise à jour avec succès" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: "Erreur lors de la mise à jour du type de chambre",
        error
      });
    }
  }

  static async supprimerTypeChambre(req, res) {
    const { id } = req.params;
    try {
      await prisma.typeChambre.delete({
        where: { id: parseInt(id) }
      });
      res.json({ message: "Type de chambre supprimer avec sucess" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: "Erreur lors de la suppression du type de chambre",
        error
      });
    }
  }
}

export default TypeChambreController;
