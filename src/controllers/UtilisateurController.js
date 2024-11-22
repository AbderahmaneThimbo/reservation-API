import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import i18next from "../i18nextConfig.js";

const prisma = new PrismaClient();

export const creerUtilisateur = async (req, res) => {
  try {
    const { nom, email, role, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const utilisateurExistant = await prisma.utilisateur.findUnique({
      where: { email }
    });

    if (utilisateurExistant) {
      return res
        .status(400)
        .json({ message: i18next.t("user.emailAlreadyUsed") });
    }

    const nouvelUtilisateur = await prisma.utilisateur.create({
      data: {
        nom,
        email,
        role: role === "ADMIN" ? "ADMIN" : "GESTIONNAIRE",
        password: hashedPassword,
        status: true
      }
    });

    return res.status(201).json({
      message: i18next.t("user.createdSuccessfully"),
      utilisateur: nouvelUtilisateur
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: i18next.t("error.generalError") });
  }
};

export const afficherUtilisateurs = async (req, res) => {
  try {
    const utilisateurs = await prisma.utilisateur.findMany();
    return res.status(200).json(utilisateurs);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: i18next.t("error.fetchUsersError") });
  }
};

export const afficherUtilisateurParId = async (req, res) => {
  const { id } = req.params;
  try {
    const utilisateur = await prisma.utilisateur.findUnique({
      where: { id: parseInt(id) },
      select: {
        id: true,
        nom: true,
        email: true,
        role: true,
        status: true
      }
    });

    if (!utilisateur) {
      return res.status(404).json({ message: i18next.t("user.notFound") });
    }

    return res.status(200).json(utilisateur);
  } catch (error) {
    console.error(error);
    return res.status(404).json({ message: i18next.t("error.generalError") });
  }
};

export const mettreAjourUtilisateur = async (req, res) => {
  const { id } = req.params;
  const { nom, email, role, password, status } = req.body;

  try {
    const dataToUpdate = {
      nom,
      email,
      role: role === "ADMIN" ? "ADMIN" : "GESTIONNAIRE",
      status
    };

    if (password) {
      dataToUpdate.password = await bcrypt.hash(password, 10);
    }

    const utilisateur = await prisma.utilisateur.findUnique({
      where: { id: parseInt(id) }
    });

    if (!utilisateur) {
      return res.status(404).json({ message: i18next.t("user.notFound") });
    }

    const utilisateurExistant = await prisma.utilisateur.findUnique({
      where: { email }
    });

    if (utilisateurExistant && utilisateurExistant.id !== parseInt(id)) {
      return res
        .status(400)
        .json({ message: i18next.t("user.emailAlreadyUsed") });
    }

    const utilisateurMisAJour = await prisma.utilisateur.update({
      where: { id: parseInt(id) },
      data: dataToUpdate
    });

    return res.status(200).json({
      message: i18next.t("user.updatedSuccessfully"),
      utilisateur: utilisateurMisAJour
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: i18next.t("error.generalError") });
  }
};

export const supprimerUtilisateur = async (req, res) => {
  const { id } = req.params;
  try {
    const utilisateur = await prisma.utilisateur.findUnique({
      where: { id: parseInt(id) }
    });

    if (!utilisateur) {
      return res.status(404).json({ message: i18next.t("user.notFound") });
    }

    await prisma.utilisateur.delete({
      where: { id: parseInt(id) }
    });

    return res
      .status(200)
      .json({ message: i18next.t("user.deletedSuccessfully") });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: i18next.t("error.generalError") });
  }
};

export const mettreAjourProfil = async (req, res) => {
  const { nom, email, currentPassword, newPassword } = req.body;
  const utilisateurId = req.utilisateur.utilisateurId;

  if (!utilisateurId) {
    return res.status(400).json({ message: "Utilisateur non trouvé." });
  }

  try {
    const utilisateur = await prisma.utilisateur.findUnique({
      where: { id: utilisateurId }
    });

    if (!utilisateur) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({
          message:
            "Veuillez fournir votre mot de passe actuel pour le modifier."
        });
      }

      const isPasswordValid = await bcrypt.compare(
        currentPassword,
        utilisateur.password
      );
      if (!isPasswordValid) {
        return res
          .status(401)
          .json({ message: "Mot de passe actuel incorrect." });
      }
    }

    const dataToUpdate = {};
    if (nom) dataToUpdate.nom = nom;
    if (email) {
      const utilisateurExistant = await prisma.utilisateur.findUnique({
        where: { email }
      });
      if (utilisateurExistant && utilisateurExistant.id !== utilisateurId) {
        return res.status(400).json({ message: "L'email est déjà utilisé." });
      }
      dataToUpdate.email = email;
    }
    if (newPassword) {
      dataToUpdate.password = await bcrypt.hash(newPassword, 10);
    }

    const utilisateurMisAJour = await prisma.utilisateur.update({
      where: { id: utilisateurId },
      data: dataToUpdate
    });

    const { password, ...utilisateurSansMotDePasse } = utilisateurMisAJour;

    return res.status(200).json({
      message: "Profil mis à jour avec succès.",
      utilisateur: utilisateurSansMotDePasse
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Erreur lors de la mise à jour du profil." });
  }
};
