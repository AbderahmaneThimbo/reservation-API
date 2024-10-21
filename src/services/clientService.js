import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const ClientService = {
  creerClient: async data => {
    return await prisma.client.create({ data });
  },

  trouverClientParTelephone: async telephone => {
    return await prisma.client.findUnique({
      where: { telephone }
    });
  },

  trouverUtilisateurParId: async utilisateurId => {
    return await prisma.utilisateur.findUnique({
      where: { id: utilisateurId }
    });
  },

  trouverClients: async () => {
    return await prisma.client.findMany({
      include: {
        utilisateur: true,
        reservations: true
      }
    });
  },

  trouverClientParId: async id => {
    return await prisma.client.findUnique({
      where: { id: parseInt(id) },
      include: {
        utilisateur: true,
        reservations: true
      }
    });
  },

  mettreAJourClient: async (id, data) => {
    return await prisma.client.update({
      where: { id: parseInt(id) },
      data
    });
  },

  supprimerClient: async id => {
    return await prisma.client.delete({
      where: { id: parseInt(id) }
    });
  }
};
