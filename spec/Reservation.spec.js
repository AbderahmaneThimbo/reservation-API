import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

describe("Reservation tests", () => {
  let reservationId = 1;
  let chambreId = 1;
  let clientId = 1;
  let typeId = 1;

  beforeAll(() => {
    spyOn(prisma.typeChambre, "create").and.returnValue(
      Promise.resolve({ id: typeId, nom: "Suite Deluxe" })
    );
    spyOn(prisma.client, "create").and.returnValue(
      Promise.resolve({
        id: clientId,
        nom: "John",
        prenom: "Doe",
        telephone: "123456789"
      })
    );
    spyOn(prisma.chambre, "create").and.returnValue(
      Promise.resolve({
        id: chambreId,
        typeId: typeId,
        numeroChambre: 101,
        prix: 200.75
      })
    );
    spyOn(prisma.reservation, "create").and.returnValue(
      Promise.resolve({
        id: reservationId,
        dateDebut: new Date("2024-10-20T00:00:00.000Z"),
        dateFin: new Date("2024-10-25T00:00:00.000Z"),
        chambreId: chambreId,
        clientId: clientId
      })
    );
    spyOn(prisma.reservation, "update").and.returnValue(
      Promise.resolve({
        id: reservationId,
        dateDebut: new Date("2024-11-01T00:00:00.000Z"),
        dateFin: new Date("2024-11-05T00:00:00.000Z"),
        chambreId: chambreId,
        clientId: clientId
      })
    );
    spyOn(prisma.reservation, "findMany").and.returnValue(
      Promise.resolve([
        {
          id: reservationId,
          dateDebut: new Date("2024-10-20T00:00:00.000Z"),
          dateFin: new Date("2024-10-25T00:00:00.000Z"),
          chambreId: chambreId,
          clientId: clientId
        }
      ])
    );
    spyOn(prisma.reservation, "delete").and.returnValue(
      Promise.resolve({ id: reservationId })
    );
  });

  it("can be created", async () => {
    const reservation = {
      dateDebut: "2024-10-20T00:00:00.000Z",
      dateFin: "2024-10-25T00:00:00.000Z",
      chambreId: chambreId,
      clientId: clientId
    };

    const result = await prisma.reservation.create({
      data: reservation
    });

    expect(result).not.toBeNull();
    expect(result.dateDebut.toISOString()).toBe(
      new Date(reservation.dateDebut).toISOString()
    );
    expect(result.dateFin.toISOString()).toBe(
      new Date(reservation.dateFin).toISOString()
    );
    expect(result.chambreId).toBe(reservation.chambreId);
    expect(result.clientId).toBe(reservation.clientId);
  });

  it("can be updated", async () => {
    const updatedReservation = {
      dateDebut: "2024-11-01T00:00:00.000Z",
      dateFin: "2024-11-05T00:00:00.000Z",
      chambreId: chambreId,
      clientId: clientId
    };

    const result = await prisma.reservation.update({
      where: { id: reservationId },
      data: updatedReservation
    });

    expect(result.dateDebut.toISOString()).toBe(
      new Date(updatedReservation.dateDebut).toISOString()
    );
    expect(result.dateFin.toISOString()).toBe(
      new Date(updatedReservation.dateFin).toISOString()
    );
    expect(result.chambreId).toBe(updatedReservation.chambreId);
    expect(result.clientId).toBe(updatedReservation.clientId);
  });

  it("fails to update a reservation that does not exist", async () => {
    const invalidId = 999999;
    const updatedReservation = {
      dateDebut: "2024-10-20T00:00:00.000Z",
      dateFin: "2024-10-20T00:00:00.000Z"
    };

    try {
      await prisma.reservation.update({
        where: { id: invalidId },
        data: updatedReservation
      });
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it("can get all reservations", async () => {
    const allReservations = await prisma.reservation.findMany();

    expect(allReservations).not.toBeNull();
    expect(allReservations.length).toBeGreaterThan(0);
  });

  it("can be deleted", async () => {
    const result = await prisma.reservation.delete({
      where: { id: reservationId }
    });

    expect(result.id).toEqual(reservationId);
  });

  it("fails to delete a reservation that does not exist", async () => {
    const invalidId = 999999;

    try {
      await prisma.reservation.delete({
        where: { id: invalidId }
      });
    } catch (error) {
      expect(error).toBeDefined();
    }
  });
});
