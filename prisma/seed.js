import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
const prisma = new PrismaClient();

async function main() {
  // Delete all existing data
  await prisma.reservation.deleteMany();
  await prisma.chambre.deleteMany();
  await prisma.typeChambre.deleteMany();
  await prisma.client.deleteMany();
  await prisma.utilisateur.deleteMany();

  const adminPassword = await bcrypt.hash("securepassword", 10);
  const gestionnairePassword = await bcrypt.hash("securepassword", 10);

  // Create sample data
  const adminUser = await prisma.utilisateur.create({
    data: {
      nom: "Admin User",
      email: "admin@example.com",
      role: "ADMIN",
      password: adminPassword
    }
  });

  const gestionnaireUser = await prisma.utilisateur.create({
    data: {
      nom: "Gestionnaire User",
      email: "gestionnaire@example.com",
      role: "GESTIONNAIRE",
      password: gestionnairePassword
    }
  });

  // Create multiple clients and get their IDs
  const client1 = await prisma.client.create({
    data: {
      nom: "Client",
      prenom: "One",
      telephone: "123456789",
      utilisateurId: gestionnaireUser.id
    }
  });

  const client2 = await prisma.client.create({
    data: {
      nom: "Client",
      prenom: "Two",
      telephone: "987654321",
      utilisateurId: gestionnaireUser.id
    }
  });

  const client3 = await prisma.client.create({
    data: {
      nom: "Client",
      prenom: "Three",
      telephone: "112233445",
      utilisateurId: gestionnaireUser.id
    }
  });

  // Create types of rooms and get their IDs
  const typeChambre1 = await prisma.typeChambre.create({
    data: {
      nom: "Suite Deluxe",
      utilisateurId: gestionnaireUser.id
    }
  });

  const typeChambre2 = await prisma.typeChambre.create({
    data: {
      nom: "Chambre Standard",
      utilisateurId: gestionnaireUser.id
    }
  });

  const typeChambre3 = await prisma.typeChambre.create({
    data: {
      nom: "Chambre Economique",
      utilisateurId: gestionnaireUser.id
    }
  });

  // Create multiple rooms using the type IDs
  const chambre1 = await prisma.chambre.create({
    data: {
      numeroChambre: 101,
      prix: 150.0,
      typeId: typeChambre1.id,
      utilisateurId: gestionnaireUser.id
    }
  });

  const chambre2 = await prisma.chambre.create({
    data: {
      numeroChambre: 102,
      prix: 100.0,
      typeId: typeChambre2.id,
      utilisateurId: gestionnaireUser.id
    }
  });

  const chambre3 = await prisma.chambre.create({
    data: {
      numeroChambre: 103,
      prix: 80.0,
      typeId: typeChambre3.id,
      utilisateurId: gestionnaireUser.id
    }
  });

  // Create multiple reservations using the created IDs
  await prisma.reservation.create({
    data: {
      dateDebut: new Date("2024-11-01T14:00:00Z"),
      dateFin: new Date("2024-11-10T10:00:00Z"),
      chambreId: chambre1.id,
      clientId: client1.id,
      utilisateurId: gestionnaireUser.id,
      status: "CONFIRMEE"
    }
  });

  await prisma.reservation.create({
    data: {
      dateDebut: new Date("2024-12-01T14:00:00Z"),
      dateFin: new Date("2024-12-05T10:00:00Z"),
      chambreId: chambre2.id,
      clientId: client2.id,
      utilisateurId: gestionnaireUser.id,
      status: "EN_ATTENTE"
    }
  });

  await prisma.reservation.create({
    data: {
      dateDebut: new Date("2025-01-01T14:00:00Z"),
      dateFin: new Date("2025-01-07T10:00:00Z"),
      chambreId: chambre3.id,
      clientId: client3.id,
      utilisateurId: gestionnaireUser.id,
      status: "CONFIRMEE"
    }
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async e => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
