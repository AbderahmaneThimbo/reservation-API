import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

describe("TypeChambre tests", () => {
  let typeChambreId = null;

  beforeAll(() => {
    spyOn(prisma.typeChambre, "create").and.callFake(async data => {
      return { id: 1, nom: data.data.nom };
    });
    spyOn(prisma.typeChambre, "update").and.callFake(async data => {
      return { id: data.where.id, nom: data.data.nom };
    });
    spyOn(prisma.typeChambre, "findMany").and.callFake(async () => {
      return [{ id: 1, nom: "Super Deluxe" }];
    });
    spyOn(prisma.typeChambre, "delete").and.callFake(async data => {
      if (data.where.id === 1) {
        return { id: 1 };
      } else {
        throw new Error("TypeChambre not found");
      }
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("can be created", async () => {
    const typeChambre = { nom: "hhhhhh" };

    const result = await prisma.typeChambre.create({
      data: typeChambre
    });

    typeChambreId = result.id;
    expect(result).not.toBeNull();
    expect(result.nom).toBe(typeChambre.nom);
  });

  it("can be updated", async () => {
    const updatedTypeChambre = {
      nom: "Super Deluxe"
    };

    const result = await prisma.typeChambre.update({
      where: { id: typeChambreId },
      data: updatedTypeChambre
    });

    expect(result.nom).toBe(updatedTypeChambre.nom);
  });

  it("fails to update a TypeChambre that does not exist", async () => {
    const invalidId = 999999;
    const updatedTypeChambre = { nom: "Standard" };

    try {
      await prisma.typeChambre.update({
        where: { id: invalidId },
        data: updatedTypeChambre
      });
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it("can get all TypeChambres", async () => {
    const allTypeChambres = await prisma.typeChambre.findMany();

    expect(allTypeChambres).not.toBeNull();
    expect(allTypeChambres.length).toBeGreaterThan(0);
  });

  it("can be deleted", async () => {
    const result = await prisma.typeChambre.delete({
      where: { id: typeChambreId }
    });

    expect(result.id).toEqual(typeChambreId);
  });

  it("fails to delete a TypeChambre that does not exist", async () => {
    const invalidId = 999999;

    try {
      await prisma.typeChambre.delete({
        where: { id: invalidId }
      });
    } catch (error) {
      expect(error).toBeDefined();
    }
  });
});
