import TypeChambreService from "../services/typeChambreService.js";

class TypeChambreController {
  static async creerTypeChambre(req, res) {
    try {
      const { type } = req.body;
      await TypeChambreService.creerTypeChambre(type);
      res.status(201).json({ message: "Type de chambre ajouté avec succès" });
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
      const typesChambres = await TypeChambreService.getAllTypeChambres();
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
      const typeChambre = await TypeChambreService.getTypeChambreById(id);
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
      const typeExistant = await TypeChambreService.getTypeChambreById(id);
      if (!typeExistant) {
        return res.status(404).json({ message: "Type de chambre non trouvé" });
      }
      await TypeChambreService.updateTypeChambre(id, type);
      return res.json({ message: "Type de chambre mis à jour avec succès" });
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
      const type = await TypeChambreService.getTypeChambreById(id);
      if (!type) {
        return res.status(404).json({ message: "Type de chambre non trouvé" });
      }
      await TypeChambreService.deleteTypeChambre(id);
      return res.json({ message: "Type de chambre supprimé avec succès" });
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
