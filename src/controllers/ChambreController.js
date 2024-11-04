import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import i18next from "../i18nextConfig.js";

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
        .json({ message: i18next.t("chambre.numeroChambreExistant") });
    }

    const typeExiste = await prisma.typeChambre.findUnique({
      where: { id: typeId }
    });

    if (!typeExiste) {
      return res
        .status(404)
        .json({ message: i18next.t("chambre.typeChambreNonExistant") });
    }

    await prisma.chambre.create({
      data: {
        numeroChambre,
        prix,
        typeId,
        utilisateurId
      }
    });

    return res
      .status(201)
      .json({ message: i18next.t("chambre.chambreAjoutee") });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: i18next.t("chambre.erreurCreationChambre"),
      error
    });
  }
};

export const afficherChambres = async (req, res) => {
  try {
    const chambres = await prisma.chambre.findMany({
      include: {
        type: true,
        utilisateur: { select: { nom: true } }
      }
    });
    return res.status(200).json(chambres);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: i18next.t("chambre.erreurRecuperationChambres"),
      error
    });
  }
};

export const afficherChambreParId = async (req, res) => {
  const { id } = req.params;

  try {
    const chambreId = parseInt(id);
    if (isNaN(chambreId)) {
      return res.status(400).json({ message: i18next.t("chambre.idInvalide") });
    }
    const chambre = await prisma.chambre.findUnique({
      where: { id: chambreId },
      include: {
        utilisateur: { select: { nom: true } }
      }
    });

    if (!chambre) {
      return res
        .status(404)
        .json({ message: i18next.t("chambre.chambreNonTrouvee") });
    }
    return res.status(200).json(chambre);
  } catch (error) {
    console.error("Erreur lors de la récupération de la chambre :", error);
    return res.status(500).json({
      message: i18next.t("chambre.erreurRecuperationChambre"),
      error
    });
  }
};

// export const afficherChambresDisponibles = async (req, res) => {
//   try {
//     const chambresDisponibles = await prisma.chambre.findMany({
//       where: {
//         reservations: {
//           none: {
//             OR: [
//               {
//                 dateDebut: {
//                   lte: new Date() // Si la réservation commence avant ou à la date actuelle
//                 },
//                 dateFin: {
//                   gte: new Date() // Et se termine après ou à la date actuelle
//                 }
//               }
//             ]
//           }
//         }
//       },
//       include: {
//         type: true // Inclure les détails du type de chambre
//       }
//     });

//     return res.status(200).json(chambresDisponibles);
//   } catch (error) {
//     console.error(
//       "Erreur lors de la récupération des chambres disponibles :",
//       error
//     );
//     return res.status(500).json({
//       message: i18next.t("chambre.erreurRecuperationChambresDisponibles"),
//       error
//     });
//   }
// };

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
        .json({ message: i18next.t("chambre.chambreNonTrouvee") });
    }

    if (numeroChambre && numeroChambre !== chambre.numeroChambre) {
      const chambreExistant = await prisma.chambre.findUnique({
        where: { numeroChambre }
      });

      if (chambreExistant) {
        return res
          .status(400)
          .json({ message: i18next.t("validator.numeroChambreExists") });
      }
    }

    const updatedData = {
      ...(numeroChambre && { numeroChambre }),
      ...(prix && { prix }),
      ...(typeId && { typeId }),
      utilisateurId
    };

    await prisma.chambre.update({
      where: { id: parseInt(id) },
      data: updatedData
    });

    res.status(200).json({ message: i18next.t("chambre.chambreMiseAJour") });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la chambre :", error);
    res
      .status(500)
      .json({ message: i18next.t("chambre.erreurMiseAJourChambre"), error });
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
        .json({ message: i18next.t("chambre.chambreNonTrouvee") });
    }

    const chambreReservation = await prisma.reservation.findFirst({
      where: { chambreId: parseInt(id) }
    });

    if (chambreReservation) {
      return res
        .status(400)
        .json({ message: i18next.t("chambre.chambreAvecReservation") });
    }

    await prisma.chambre.delete({
      where: { id: parseInt(id) }
    });

    return res.json({ message: i18next.t("chambre.chambreSupprimee") });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: i18next.t("chambre.erreurSuppressionChambre"),
      error
    });
  }
};
