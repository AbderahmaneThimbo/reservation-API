import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class TypeChambreService {
  static async creerTypeChambre(type) {
    return prisma.typeChambre.create({
      data: { type }
    });
  }

  static async getAllTypeChambres() {
    return prisma.typeChambre.findMany();
  }

  static async getTypeChambreById(id) {
    return prisma.typeChambre.findUnique({
      where: { id: parseInt(id) }
    });
  }

  static async updateTypeChambre(id, type) {
    return prisma.typeChambre.update({
      where: { id: parseInt(id) },
      data: { type }
    });
  }

  static async deleteTypeChambre(id) {
    return prisma.typeChambre.delete({
      where: { id: parseInt(id) }
    });
  }
}

export default TypeChambreService;
