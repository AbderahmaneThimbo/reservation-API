import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const creerChambre = async (req, res) => {
  try {
    const { numeroChambre, prix, typeId } = req.body;
    const utilisateurId = req.utilisateur.utilisateurId;
    const chambreExistant = await prisma.chambre.findUnique({
      where: { numeroChambre }
    });

    if (chambreExistant) {
      return res
        .status(400)
        .json({ message: req.t("chambre.numeroChambreExistant") });
    }

    const typeExiste = await prisma.typeChambre.findUnique({
      where: { id: typeId }
    });

    if (!typeExiste) {
      return res
        .status(404)
        .json({ message: req.t("chambre.typeChambreNonExistant") });
    }

    await prisma.chambre.create({
      data: {
        numeroChambre,
        prix,
        typeId,
        utilisateurId
      }
    });

    return res.status(201).json({ message: req.t("chambre.chambreAjoutee") });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: req.t("chambre.erreurCreationChambre"),
      error
    });
  }
};

export const afficherChambres = async (req, res) => {
  try {
    const chambres = await prisma.chambre.findMany();
    return res.status(200).json(chambres);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: req.t("chambre.erreurRecuperationChambres"),
      error
    });
  }
};

export const afficherChambreParId = async (req, res) => {
  const { id } = req.params;
  try {
    const chambre = await prisma.chambre.findUnique({
      where: { id: parseInt(id) }
    });
    if (!chambre) {
      return res
        .status(404)
        .json({ message: req.t("chambre.chambreNonTrouvee") });
    }
    return res.status(200).json(chambre);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: req.t("chambre.erreurRecuperationChambre"),
      error
    });
  }
};

export const mettreAJourChambre = async (req, res) => {
  const { id } = req.params;
  const { numeroChambre, prix, typeId } = req.body;
  const utilisateurId = req.utilisateur.utilisateurId;
  try {
    const chambre = await prisma.chambre.findUnique({
      where: { id: parseInt(id) }
    });
    if (!chambre) {
      return res
        .status(404)
        .json({ message: req.t("chambre.chambreNonTrouvee") });
    }

    if (numeroChambre && numeroChambre !== chambre.numeroChambre) {
      const chambreExistant = await prisma.chambre.findUnique({
        where: { numeroChambre }
      });
      if (chambreExistant) {
        return res
          .status(400)
          .json({ message: req.t("chambre.numeroChambreExistant") });
      }
    }

    const typeExiste = await prisma.typeChambre.findUnique({
      where: { id: typeId }
    });
    if (!typeExiste) {
      return res
        .status(404)
        .json({ message: req.t("chambre.typeChambreNonExistant") });
    }

    await prisma.chambre.update({
      where: { id: parseInt(id) },
      data: {
        numeroChambre,
        prix,
        typeId,
        utilisateurId
      }
    });

    return res.json({ message: req.t("chambre.chambreMiseAJour") });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: req.t("chambre.erreurMiseAJourChambre"),
      error
    });
  }
};

export const supprimerChambre = async (req, res) => {
  const { id } = req.params;
  try {
    const chambre = await prisma.chambre.findUnique({
      where: { id: parseInt(id) }
    });
    if (!chambre) {
      return res
        .status(404)
        .json({ message: req.t("chambre.chambreNonTrouvee") });
    }

    const chambreReservation = await prisma.reservation.findFirst({
      where: { chambreId: parseInt(id) }
    });

    if (chambreReservation) {
      return res
        .status(400)
        .json({ message: req.t("chambre.chambreAvecReservation") });
    }

    await prisma.chambre.delete({
      where: { id: parseInt(id) }
    });

    return res.json({ message: req.t("chambre.chambreSupprimee") });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: req.t("chambre.erreurSuppressionChambre"),
      error
    });
  }
};
