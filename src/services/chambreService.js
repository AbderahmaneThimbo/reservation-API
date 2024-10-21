import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

class ChambreService {
  static async creerChambre(data) {
    return prisma.chambre.create({ data });
  }

  static async trouverChambreParNumero(numeroChambre) {
    return prisma.chambre.findUnique({ where: { numeroChambre } });
  }

  static async trouverChambreParId(id) {
    return prisma.chambre.findUnique({ where: { id: parseInt(id) } });
  }

  static async trouverToutesLesChambres() {
    return prisma.chambre.findMany();
  }

  static async mettreAJourChambre(id, data) {
    return prisma.chambre.update({
      where: { id: parseInt(id) },
      data
    });
  }

  static async supprimerChambre(id) {
    return prisma.chambre.delete({
      where: { id: parseInt(id) }
    });
  }

  static async trouverTypeChambreParId(typeId) {
    return prisma.typeChambre.findUnique({ where: { id: typeId } });
  }

  static async trouverUtilisateurParId(utilisateurId) {
    return prisma.utilisateur.findUnique({ where: { id: utilisateurId } });
  }
}

export default ChambreService;
