import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

describe("Client tests", () => {
  let clientId = null;

  beforeAll(() => {
    spyOn(prisma.client, "create").and.callFake(async data => {
      return {
        id: 1,
        nom: data.data.nom,
        prenom: data.data.prenom,
        telephone: data.data.telephone
      };
    });
    spyOn(prisma.client, "update").and.callFake(async data => {
      if (data.where.id === 1) {
        return {
          id: 1,
          nom: data.data.nom,
          prenom: data.data.prenom,
          telephone: data.data.telephone
        };
      } else {
        throw new Error("Client not found");
      }
    });
    spyOn(prisma.client, "findMany").and.callFake(async () => {
      return [{ id: 1, nom: "abdu", prenom: "thimbo", telephone: "147474747" }];
    });
    spyOn(prisma.client, "delete").and.callFake(async data => {
      if (data.where.id === 1) {
        return { id: 1 };
      } else {
        throw new Error("Client not found");
      }
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("can be created", async () => {
    const client = {
      nom: "abdu",
      prenom: "thimbo",
      telephone: "147474747"
    };

    const result = await prisma.client.create({
      data: client
    });

    clientId = result.id;
    expect(result).not.toBeNull();
    expect(result.nom).toBe(client.nom);
    expect(result.prenom).toBe(client.prenom);
    expect(result.telephone).toBe(client.telephone);
  });

  it("can be updated", async () => {
    const updatedClient = {
      nom: "whab",
      prenom: "thimbo",
      telephone: "147474745"
    };

    const result = await prisma.client.update({
      where: { id: clientId },
      data: updatedClient
    });

    expect(result.nom).toBe(updatedClient.nom);
    expect(result.prenom).toBe(updatedClient.prenom);
    expect(result.telephone).toBe(updatedClient.telephone);
  });

  it("fails to update a client that does not exist", async () => {
    const invalidId = 999999;
    const updatedClient = {
      nom: "fhgjf",
      prenom: "jhgd",
      telephone: "222222222"
    };

    try {
      await prisma.client.update({
        where: { id: invalidId },
        data: updatedClient
      });
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it("can get all clients", async () => {
    const allClients = await prisma.client.findMany();

    expect(allClients).not.toBeNull();
    expect(allClients.length).toBeGreaterThan(0);
  });

  it("can be deleted", async () => {
    const result = await prisma.client.delete({
      where: { id: clientId }
    });

    expect(result.id).toEqual(clientId);
  });

  it("fails to delete a client that does not exist", async () => {
    const invalidId = 999999;

    try {
      await prisma.client.delete({
        where: { id: invalidId }
      });
    } catch (error) {
      expect(error).toBeDefined();
    }
  });
});
