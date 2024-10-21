import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class ReservationService {
  static async creerReservation(data) {
    return prisma.reservation.create({
      data
    });
  }

  static async getAllReservations() {
    return prisma.reservation.findMany({
      include: {
        chambre: true,
        client: true,
        utilisateur: true
      }
    });
  }

  static async getReservationById(id) {
    return prisma.reservation.findUnique({
      where: { id: parseInt(id) },
      include: {
        chambre: true,
        client: true,
        utilisateur: true
      }
    });
  }

  static async updateReservation(id, data) {
    return prisma.reservation.update({
      where: { id: parseInt(id) },
      data
    });
  }

  static async deleteReservation(id) {
    return prisma.reservation.delete({
      where: { id: parseInt(id) }
    });
  }

  static async chambreExiste(chambreId) {
    return prisma.chambre.findUnique({
      where: { id: chambreId }
    });
  }

  static async clientExiste(clientId) {
    return prisma.client.findUnique({
      where: { id: clientId }
    });
  }

  static async utilisateurExiste(utilisateurId) {
    return prisma.utilisateur.findUnique({
      where: { id: utilisateurId }
    });
  }
}

export default ReservationService;
