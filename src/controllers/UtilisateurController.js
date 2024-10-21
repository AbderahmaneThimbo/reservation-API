import bcrypt from "bcrypt";
import UtilisateurService from "../services/UtilisateurService.js";

class UtilisateurController {
  static async creerUtilisateur(req, res) {
    try {
      const { nom, email, role, motDePasse } = req.body;
      const hashedPassword = await bcrypt.hash(motDePasse, 10);

      const nouvelUtilisateur = await UtilisateurService.creerUtilisateur({
        nom,
        email,
        role,
        motDePasse: hashedPassword
      });

      return res
        .status(201)
        .json({
          message: "Utilisateur ajouté avec succès",
          utilisateur: nouvelUtilisateur
        });
    } catch (error) {
      console.error(error);
      return res.status(400).json({ message: error.message });
    }
  }

  static async getUtilisateurs(req, res) {
    try {
      const utilisateurs = await UtilisateurService.getUtilisateurs();
      return res.status(200).json(utilisateurs);
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: "Erreur lors de la récupération des utilisateurs" });
    }
  }

  static async getUtilisateurById(req, res) {
    const { id } = req.params;
    try {
      const utilisateur = await UtilisateurService.getUtilisateurById(id);
      return res.status(200).json(utilisateur);
    } catch (error) {
      console.error(error);
      return res.status(404).json({ message: error.message });
    }
  }

  static async updateUtilisateur(req, res) {
    const { id } = req.params;
    const { nom, email, role, motDePasse } = req.body;

    try {
      const dataToUpdate = {
        nom,
        email,
        role: role === "ADMIN" ? "ADMIN" : "UTILISATEUR"
      };

      if (motDePasse) {
        dataToUpdate.motDePasse = await bcrypt.hash(motDePasse, 10);
      }

      const utilisateurMisAJour = await UtilisateurService.updateUtilisateur(
        id,
        dataToUpdate
      );
      return res
        .status(200)
        .json({
          message: "Utilisateur mis à jour avec succès",
          utilisateur: utilisateurMisAJour
        });
    } catch (error) {
      console.error(error);
      return res.status(400).json({ message: error.message });
    }
  }

  static async supprimerUtilisateur(req, res) {
    const { id } = req.params;
    try {
      await UtilisateurService.supprimerUtilisateur(id);
      return res
        .status(200)
        .json({ message: "Utilisateur supprimé avec succès" });
    } catch (error) {
      console.error(error);
      return res.status(400).json({ message: error.message });
    }
  }
}

export default UtilisateurController;
