import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class UtilisateurService {
  static async creerUtilisateur(data) {
    const { nom, email, role, motDePasse } = data;

    const utilisateurExistant = await prisma.utilisateur.findUnique({
      where: { email }
    });

    if (utilisateurExistant) {
      throw new Error("Cet email est déjà utilisé");
    }

    const nouvelUtilisateur = await prisma.utilisateur.create({
      data: {
        nom,
        email,
        role: role === "ADMIN" ? "ADMIN" : "UTILISATEUR",
        motDePasse
      }
    });

    return nouvelUtilisateur;
  }

  static async getUtilisateurs() {
    return await prisma.utilisateur.findMany();
  }

  static async getUtilisateurById(id) {
    const utilisateur = await prisma.utilisateur.findUnique({
      where: { id: parseInt(id) }
    });

    if (!utilisateur) {
      throw new Error("Utilisateur non trouvé");
    }

    return utilisateur;
  }

  static async updateUtilisateur(id, data) {
    const utilisateur = await prisma.utilisateur.findUnique({
      where: { id: parseInt(id) }
    });

    if (!utilisateur) {
      throw new Error("Utilisateur non trouvé");
    }

    const utilisateurExistant = await prisma.utilisateur.findUnique({
      where: { email: data.email }
    });

    if (utilisateurExistant && utilisateurExistant.id !== id) {
      throw new Error("Cet email est déjà utilisé");
    }

    const utilisateurMisAJour = await prisma.utilisateur.update({
      where: { id: parseInt(id) },
      data
    });

    return utilisateurMisAJour;
  }

  static async supprimerUtilisateur(id) {
    const utilisateur = await prisma.utilisateur.findUnique({
      where: { id: parseInt(id) }
    });

    if (!utilisateur) {
      throw new Error("Utilisateur non trouvé");
    }

    await prisma.utilisateur.delete({
      where: { id: parseInt(id) }
    });

    return utilisateur;
  }
}

export default UtilisateurService;
