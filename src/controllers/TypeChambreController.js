import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const creerTypeChambre = async (req, res) => {
  try {
    const { nom } = req.body;
    const utilisateurId = req.utilisateur.utilisateurId;

    const nomExistant = await prisma.typeChambre.findUnique({
      where: { nom }
    });

    if (nomExistant) {
      return res
        .status(400)
        .json({ message: "Le nom du type de chambre est existe déja" });
    }

    await prisma.typeChambre.create({
      data: { nom, utilisateurId }
    });

    res.status(201).json({ message: "Type de chambre ajouté avec succès" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Erreur lors de la création du type de chambre",
      error
    });
  }
};

export const afficherTypeChambres = async (req, res) => {
  try {
    const typesChambres = await prisma.typeChambre.findMany({
      include: {
        utilisateur: false
      }
    });
    return res.status(200).json(typesChambres);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Erreur lors de la récupération des types de chambres",
      error
    });
  }
};

export const afficherTypeChambreParId = async (req, res) => {
  const { id } = req.params;
  try {
    const typeChambre = await prisma.typeChambre.findUnique({
      where: { id: parseInt(id) },
      include: {
        utilisateur: true
      }
    });

    if (!typeChambre) {
      return res.status(404).json({ message: "Type de chambre non trouvé" });
    }

    return res.status(200).json(typeChambre);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Erreur lors de la récupération du type de chambre",
      error
    });
  }
};

export const mettreAJourTypeChambre = async (req, res) => {
  const { id } = req.params;
  const { nom } = req.body;
  const utilisateurId = req.utilisateur.utilisateurId;
  try {
    const typeExistant = await prisma.typeChambre.findUnique({
      where: { id: parseInt(id) }
    });

    if (!typeExistant) {
      return res.status(404).json({ message: "Type de chambre non trouvé" });
    }

    await prisma.typeChambre.update({
      where: { id: parseInt(id) },
      data: { nom, utilisateurId }
    });

    return res.json({ message: "Type de chambre mis à jour avec succès" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Erreur lors de la mise à jour du type de chambre",
      error
    });
  }
};

export const supprimerTypeChambre = async (req, res) => {
  const { id } = req.params;
  try {
    const typeChambre = await prisma.typeChambre.findUnique({
      where: { id: parseInt(id) }
    });

    if (!typeChambre) {
      return res.status(404).json({ message: "Type de chambre non trouvé" });
    }
    const chambresUtilisantType = await prisma.chambre.findFirst({
      where: { typeId: parseInt(id) }
    });

    if (chambresUtilisantType) {
      return res
        .status(400)
        .json({ message: "Ce type est utilisé par une chambre" });
    }

    await prisma.typeChambre.delete({
      where: { id: parseInt(id) }
    });

    return res.json({ message: "Type de chambre supprimé avec succès" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Erreur lors de la suppression du type de chambre",
      error
    });
  }
};
