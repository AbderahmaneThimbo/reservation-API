import ChambreService from "../services/chambreService.js";

class ChambreController {
  static async creerChambre(req, res) {
    try {
      const { numeroChambre, prix, typeId, utilisateurId } = req.body;

      const chambreExistant = await ChambreService.trouverChambreParNumero(
        numeroChambre
      );
      if (chambreExistant) {
        return res
          .status(400)
          .json({ message: "Le numéro de chambre est déjà utilisé" });
      }

      const typeExiste = await ChambreService.trouverTypeChambreParId(typeId);
      if (!typeExiste) {
        return res
          .status(404)
          .json({ message: "Le type de chambre n'existe pas" });
      }

      const utilisateurExiste = await ChambreService.trouverUtilisateurParId(
        utilisateurId
      );
      if (!utilisateurExiste) {
        return res.status(404).json({ message: "L'utilisateur n'existe pas" });
      }

      await ChambreService.creerChambre({
        numeroChambre,
        prix,
        typeId,
        utilisateurId
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
      const chambres = await ChambreService.trouverToutesLesChambres();
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
      const chambre = await ChambreService.trouverChambreParId(id);
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
      const chambre = await ChambreService.trouverChambreParId(id);
      if (!chambre) {
        return res.status(404).json({ message: "Chambre non trouvée" });
      }

      const chambreExistant = await ChambreService.trouverChambreParNumero(
        numeroChambre
      );
      if (chambreExistant) {
        return res.status(400).json({ message: "Ce numéro est déjà utilisé" });
      }

      const typeExiste = await ChambreService.trouverTypeChambreParId(typeId);
      if (!typeExiste) {
        return res
          .status(404)
          .json({ message: "Le type de chambre n'existe pas" });
      }

      const utilisateurExiste = await ChambreService.trouverUtilisateurParId(
        utilisateurId
      );
      if (!utilisateurExiste) {
        return res.status(404).json({ message: "L'utilisateur n'existe pas" });
      }

      await ChambreService.mettreAJourChambre(id, {
        numeroChambre,
        prix,
        typeId,
        utilisateurId
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
      const chambre = await ChambreService.trouverChambreParId(id);
      if (!chambre) {
        return res.status(404).json({ message: "Chambre non trouvée" });
      }
      await ChambreService.supprimerChambre(id);
      return res.json({ message: "Chambre supprimée avec succès" });
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
