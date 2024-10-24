import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

describe("Chambre tests", () => {
  let chambreId = null;
  let typeId = null;

  beforeAll(() => {
    spyOn(prisma.typeChambre, "create").and.callFake(async data => {
      return { id: 1, nom: data.data.nom };
    });
    spyOn(prisma.typeChambre, "delete").and.callFake(async data => {
      if (data.where.id === 1) {
        return { id: 1 };
      } else {
        throw new Error("TypeChambre not found");
      }
    });
    spyOn(prisma.chambre, "create").and.callFake(async data => {
      return {
        id: 1,
        numeroChambre: data.data.numeroChambre,
        prix: data.data.prix,
        typeId: data.data.typeId
      };
    });
    spyOn(prisma.chambre, "update").and.callFake(async data => {
      if (data.where.id === 1) {
        return {
          id: 1,
          numeroChambre: data.data.numeroChambre,
          prix: data.data.prix,
          typeId: data.data.typeId
        };
      } else {
        throw new Error("Chambre not found");
      }
    });
    spyOn(prisma.chambre, "findMany").and.callFake(async () => {
      return [{ id: 1, numeroChambre: 101, prix: 150.5, typeId: 1 }];
    });
    spyOn(prisma.chambre, "delete").and.callFake(async data => {
      if (data.where.id === 1) {
        return { id: 1 };
      } else {
        throw new Error("Chambre not found");
      }
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("can be created", async () => {
    const chambre = {
      numeroChambre: 1,
      prix: 150.5,
      typeId: 1
    };

    const result = await prisma.chambre.create({
      data: chambre
    });

    chambreId = result.id;
    expect(result).not.toBeNull();
    expect(result.numeroChambre).toBe(chambre.numeroChambre);
    expect(result.prix).toBe(chambre.prix);
    expect(result.typeId).toBe(chambre.typeId);
  });

  it("can be updated", async () => {
    const updatedChambre = {
      numeroChambre: 502,
      prix: 200.75,
      typeId: 1
    };

    const result = await prisma.chambre.update({
      where: { id: chambreId },
      data: updatedChambre
    });

    expect(result.numeroChambre).toBe(updatedChambre.numeroChambre);
    expect(result.prix).toBe(updatedChambre.prix);
  });

  it("fails to update a Chambre that does not exist", async () => {
    const invalidId = 999999;
    const updatedChambre = { numeroChambre: 999, prix: 100.5, typeId: 1 };

    try {
      await prisma.chambre.update({
        where: { id: invalidId },
        data: updatedChambre
      });
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it("can get all Chambres", async () => {
    const allChambres = await prisma.chambre.findMany();

    expect(allChambres).not.toBeNull();
    expect(allChambres.length).toBeGreaterThan(0);
  });

  it("can be deleted", async () => {
    const result = await prisma.chambre.delete({
      where: { id: chambreId }
    });

    expect(result.id).toEqual(chambreId);
    chambreId = null;
  });

  it("fails to delete a Chambre that does not exist", async () => {
    const invalidId = 999999;

    try {
      await prisma.chambre.delete({
        where: { id: invalidId }
      });
    } catch (error) {
      expect(error).toBeDefined();
    }
  });
});
