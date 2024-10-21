import ReservationService from "../services/reservationService.js";

export class ReservationController {
  static async creerReservation(req, res) {
    try {
      const {
        dateDebut,
        dateFin,
        chambreId,
        clientId,
        utilisateurId
      } = req.body;

      const chambreExiste = await ReservationService.chambreExiste(chambreId);
      if (!chambreExiste) {
        return res.status(404).json({ message: "La chambre n'existe pas" });
      }

      const clientExiste = await ReservationService.clientExiste(clientId);
      if (!clientExiste) {
        return res.status(404).json({ message: "Le client n'existe pas" });
      }

      const utilisateurExiste = await ReservationService.utilisateurExiste(
        utilisateurId
      );
      if (!utilisateurExiste) {
        return res.status(404).json({ message: "L'utilisateur n'existe pas" });
      }

      const nouvelleReservation = await ReservationService.creerReservation({
        dateDebut: new Date(dateDebut),
        dateFin: new Date(dateFin),
        chambreId,
        clientId,
        utilisateurId
      });

      res.status(201).json({ message: "Réservation ajoutée avec succès" });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Erreur lors de la création de la réservation",
        error
      });
    }
  }

  static async getReservations(req, res) {
    try {
      const reservations = await ReservationService.getAllReservations();
      res.status(200).json(reservations);
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Erreur lors de la récupération des réservations",
        error
      });
    }
  }

  static async getReservationById(req, res) {
    const { id } = req.params;
    try {
      const reservation = await ReservationService.getReservationById(id);
      if (!reservation) {
        return res.status(404).json({ message: "Réservation non trouvée" });
      }
      res.status(200).json(reservation);
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Erreur lors de la récupération de la réservation",
        error
      });
    }
  }

  static async mettreAJourReservation(req, res) {
    const { id } = req.params;
    const { dateDebut, dateFin, chambreId, clientId, utilisateurId } = req.body;

    try {
      const reservationExiste = await ReservationService.getReservationById(id);
      if (!reservationExiste) {
        return res.status(404).json({ message: "Réservation non trouvée" });
      }

      // Vérification de l'existence des entités liées
      const chambreExiste = await ReservationService.chambreExiste(chambreId);
      if (!chambreExiste) {
        return res.status(404).json({ message: "La chambre n'existe pas" });
      }

      const clientExiste = await ReservationService.clientExiste(clientId);
      if (!clientExiste) {
        return res.status(404).json({ message: "Le client n'existe pas" });
      }

      const utilisateurExiste = await ReservationService.utilisateurExiste(
        utilisateurId
      );
      if (!utilisateurExiste) {
        return res.status(404).json({ message: "L'utilisateur n'existe pas" });
      }

      const reservationMiseAJour = await ReservationService.updateReservation(
        id,
        {
          dateDebut: new Date(dateDebut),
          dateFin: new Date(dateFin),
          chambreId,
          clientId,
          utilisateurId
        }
      );

      res.json({ message: "Réservation mise à jour avec succès" });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Erreur lors de la mise à jour de la réservation",
        error
      });
    }
  }

  static async supprimerReservation(req, res) {
    const { id } = req.params;
    try {
      const reservation = await ReservationService.getReservationById(id);
      if (!reservation) {
        return res.status(404).json({ message: "Réservation non trouvée" });
      }

      await ReservationService.deleteReservation(id);

      res.json({ message: "Réservation supprimée avec succès" });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Erreur lors de la suppression de la réservation",
        error
      });
    }
  }
}
