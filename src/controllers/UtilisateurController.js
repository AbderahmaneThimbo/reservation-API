import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export const creerUtilisateur = async (req, res) => {
  try {
    const { nom, email, role, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const utilisateurExistant = await prisma.utilisateur.findUnique({
      where: { email }
    });

    if (utilisateurExistant) {
      return res.status(400).json({ message: req.t("user.emailAlreadyUsed") });
    }

    const nouvelUtilisateur = await prisma.utilisateur.create({
      data: {
        nom,
        email,
        role: role === "ADMIN" ? "ADMIN" : "GESTIONNAIRE",
        password: hashedPassword
      }
    });

    return res.status(201).json({
      message: req.t("user.createdSuccessfully"),
      utilisateur: nouvelUtilisateur
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: req.t("error.generalError") });
  }
};

export const afficherUtilisateurs = async (req, res) => {
  try {
    const utilisateurs = await prisma.utilisateur.findMany();
    return res.status(200).json(utilisateurs);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: req.t("error.fetchUsersError") });
  }
};

export const afficherUtilisateurParId = async (req, res) => {
  const { id } = req.params;
  try {
    const utilisateur = await prisma.utilisateur.findUnique({
      where: { id: parseInt(id) }
    });

    if (!utilisateur) {
      return res.status(404).json({ message: req.t("user.notFound") });
    }

    return res.status(200).json(utilisateur);
  } catch (error) {
    console.error(error);
    return res.status(404).json({ message: req.t("error.generalError") });
  }
};

export const mettreAjourUtilisateur = async (req, res) => {
  const { id } = req.params;
  const { nom, email, role, password } = req.body;

  try {
    const dataToUpdate = {
      nom,
      email,
      role: role === "ADMIN" ? "ADMIN" : "GESTIONNAIRE"
    };

    if (password) {
      dataToUpdate.password = await bcrypt.hash(password, 10);
    }

    const utilisateur = await prisma.utilisateur.findUnique({
      where: { id: parseInt(id) }
    });

    if (!utilisateur) {
      return res.status(404).json({ message: req.t("user.notFound") });
    }

    const utilisateurExistant = await prisma.utilisateur.findUnique({
      where: { email }
    });

    if (utilisateurExistant && utilisateurExistant.id !== parseInt(id)) {
      return res.status(400).json({ message: req.t("user.emailAlreadyUsed") });
    }

    const utilisateurMisAJour = await prisma.utilisateur.update({
      where: { id: parseInt(id) },
      data: dataToUpdate
    });

    return res.status(200).json({
      message: req.t("user.updatedSuccessfully"),
      utilisateur: utilisateurMisAJour
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: req.t("error.generalError") });
  }
};

export const supprimerUtilisateur = async (req, res) => {
  const { id } = req.params;
  try {
    const utilisateur = await prisma.utilisateur.findUnique({
      where: { id: parseInt(id) }
    });

    if (!utilisateur) {
      return res.status(404).json({ message: req.t("user.notFound") });
    }

    await prisma.utilisateur.delete({
      where: { id: parseInt(id) }
    });

    return res.status(200).json({ message: req.t("user.deletedSuccessfully") });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: req.t("error.generalError") });
  }
};
