import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class UtilisateurController {
  static async creerUtilisateur(req, res) {
    try {
      const { nom, email, role, motDePasse } = req.body;

      // Vérifier si l'utilisateur existe déjà
      const utilisateurExistant = await prisma.utilisateur.findUnique({
        where: { email }
      });

      if (utilisateurExistant) {
        return res.status(400).json({ message: "Cet email est déjà utilisé" });
      }

      // Hash du mot de passe avant de le sauvegarder
      const hashedPassword = await bcrypt.hash(motDePasse, 10);

      // Créer un nouvel utilisateur dans la base de données
      const nouvelUtilisateur = await prisma.utilisateur.create({
        data: {
          nom,
          email,
          role,
          motDePasse: hashedPassword
        }
      });

      res.status(201).json({ message: "Utilisateur ajoutée avec succès" });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Erreur lors de la création de l'utilisateur",
        error
      });
    }
  }

  static async getUtilisateurs(req, res) {
    try {
      const utilisateurs = await prisma.utilisateur.findMany();
      res.status(200).json(utilisateurs);
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Erreur lors de la récupération des utilisateurs",
        error
      });
    }
  }

  static async getUtilisateurById(req, res) {
    const { id } = req.params;
    try {
      const utilisateur = await prisma.utilisateur.findUnique({
        where: { id: parseInt(id) }
      });

      if (!utilisateur) {
        return res.status(404).json({ message: "Utilisateur non trouvé" });
      }

      res.status(200).json(utilisateur);
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Erreur lors de la récupération de l'utilisateur",
        error
      });
    }
  }

  static async updateUtilisateur(req, res) {
    const { id } = req.params;
    const { nom, email, role, motDePasse } = req.body;

    try {
      const utilisateur = await prisma.utilisateur.findUnique({
        where: { id: parseInt(id) }
      });

      if (!utilisateur) {
        return res.status(404).json({ message: "Utilisateur non trouvé" });
      }

      const dataToUpdate = {
        nom,
        email,
        role
      };

      if (motDePasse) {
        dataToUpdate.motDePasse = await bcrypt.hash(motDePasse, 10);
      }

      const utilisateurMisAJour = await prisma.utilisateur.update({
        where: { id: parseInt(id) },
        data: dataToUpdate
      });

      res.json({ message: "Utilisateur mise à jour avec succès" });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Erreur lors de la mise à jour de l'utilisateur",
        error
      });
    }
  }

  static async supprimerUtilisateur(req, res) {
    const { id } = req.params;
    try {
      const utilisateur = await prisma.utilisateur.findUnique({
        where: { id: parseInt(id) }
      });

      if (!utilisateur) {
        return res.status(404).json({ message: "Utilisateur non trouvé" });
      }

      await prisma.utilisateur.delete({
        where: { id: parseInt(id) }
      });

      res.json({ message: "Utilisateur supprimer avec sucess" });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Erreur lors de la suppression de l'utilisateur",
        error
      });
    }
  }
}

export default UtilisateurController;
