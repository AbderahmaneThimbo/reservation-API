import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

describe("Utilisateur tests", () => {
  let utilisateurId = null;

  beforeAll(() => {
    spyOn(prisma.utilisateur, "create").and.callFake(async data => {
      return {
        id: 1,
        nom: data.data.nom,
        email: data.data.email,
        role: data.data.role,
        password: data.data.password
      };
    });
    spyOn(prisma.utilisateur, "update").and.callFake(async data => {
      if (data.where.id === 1) {
        return {
          id: 1,
          nom: data.data.nom,
          email: data.data.email,
          role: data.data.role,
          password: data.data.password
        };
      } else {
        throw new Error("Utilisateur not found");
      }
    });
    spyOn(prisma.utilisateur, "findMany").and.callFake(async () => {
      return [
        {
          id: 1,
          nom: "Thimbo",
          email: "thimbo@gmail.com",
          role: "ADMIN",
          password: "1234"
        }
      ];
    });
    spyOn(prisma.utilisateur, "delete").and.callFake(async data => {
      if (data.where.id === 1) {
        return { id: 1 };
      } else {
        throw new Error("Utilisateur not found");
      }
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("can be created", async () => {
    const utilisateur = {
      nom: "Thimbo",
      email: "thimbo@gmail.com",
      role: "ADMIN",
      password: "1234"
    };

    const result = await prisma.utilisateur.create({
      data: utilisateur
    });

    utilisateurId = result.id;
    expect(result).not.toBeNull();
    expect(result.nom).toBe(utilisateur.nom);
    expect(result.email).toBe(utilisateur.email);
    expect(result.role).toBe(utilisateur.role);
    expect(result.password).toBe(utilisateur.password);
  });

  it("can be updated", async () => {
    const updatedUtilisateur = {
      nom: "Thimbo",
      email: "thimbo@gmail.com",
      role: "GESTIONNAIRE",
      password: "1234"
    };

    const result = await prisma.utilisateur.update({
      where: { id: utilisateurId },
      data: updatedUtilisateur
    });

    expect(result.nom).toBe(updatedUtilisateur.nom);
    expect(result.email).toBe(updatedUtilisateur.email);
    expect(result.role).toBe(updatedUtilisateur.role);
    expect(result.password).toBe(updatedUtilisateur.password);
  });

  it("fails to update a utilisateur that does not exist", async () => {
    const invalidId = 999999;
    const updatedUtilisateur = {
      nom: "Thimbo",
      email: "thimbo@gmail.com",
      role: "garage",
      password: "1234"
    };

    try {
      await prisma.utilisateur.update({
        where: { id: invalidId },
        data: updatedUtilisateur
      });
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it("can get all utilisateurs", async () => {
    const allUtilisateurs = await prisma.utilisateur.findMany();

    expect(allUtilisateurs).not.toBeNull();
    expect(allUtilisateurs.length).toBeGreaterThan(0);
  });

  it("can be deleted", async () => {
    const result = await prisma.utilisateur.delete({
      where: { id: utilisateurId }
    });

    expect(result.id).toEqual(utilisateurId);
  });

  it("fails to delete a utilisateur that does not exist", async () => {
    const invalidId = 999999;

    try {
      await prisma.utilisateur.delete({
        where: { id: invalidId }
      });
    } catch (error) {
      expect(error).toBeDefined();
    }
  });
});
