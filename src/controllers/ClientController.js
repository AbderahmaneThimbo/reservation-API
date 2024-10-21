import { ClientService } from "../services/clientService.js";

class ClientController {
  static async creerClient(req, res) {
    try {
      const { nom, prenom, telephone, utilisateurId } = req.body;

      const telephoneExistant = await ClientService.trouverClientParTelephone(
        telephone
      );

      if (telephoneExistant) {
        return res
          .status(400)
          .json({ message: "Le numéro du telephone est déjà utilisé" });
      }

      const utilisateurExiste = await ClientService.trouverUtilisateurParId(
        utilisateurId
      );
      if (!utilisateurExiste) {
        return res.status(404).json({ message: "L'utilisateur n'existe pas" });
      }

      await ClientService.creerClient({
        nom,
        prenom,
        telephone,
        utilisateurId
      });

      return res.status(201).json({ message: "Client ajouté avec succès" });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: "Erreur lors de la création du client", error });
    }
  }

  static async getClients(req, res) {
    try {
      const clients = await ClientService.trouverClients();
      return res.status(200).json(clients);
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: "Erreur lors de la récupération des clients", error });
    }
  }

  static async getClientById(req, res) {
    const { id } = req.params;
    try {
      const client = await ClientService.trouverClientParId(id);
      if (!client) {
        return res.status(404).json({ message: "Client non trouvé" });
      }
      return res.status(200).json(client);
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: "Erreur lors de la récupération du client", error });
    }
  }

  static async mettreAJourClient(req, res) {
    const { id } = req.params;
    const { nom, prenom, telephone, utilisateurId } = req.body;
    try {
      const clientExistant = await ClientService.trouverClientParId(id);
      if (!clientExistant) {
        return res.status(404).json({ message: "Client non trouvé" });
      }

      const telephoneExistant = await ClientService.trouverClientParTelephone(
        telephone
      );
      if (telephoneExistant) {
        return res
          .status(400)
          .json({ message: "Le numéro du telephone est déjà utilisé" });
      }

      const utilisateurExiste = await ClientService.trouverUtilisateurParId(
        utilisateurId
      );
      if (!utilisateurExiste) {
        return res.status(404).json({ message: "L'utilisateur n'existe pas" });
      }

      await ClientService.mettreAJourClient(id, {
        nom,
        prenom,
        telephone,
        utilisateurId
      });

      return res.json({ message: "Client mis à jour avec succès" });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: "Erreur lors de la mise à jour du client", error });
    }
  }

  static async supprimerClient(req, res) {
    const { id } = req.params;
    try {
      const client = await ClientService.trouverClientParId(id);
      if (!client) {
        return res.status(404).json({ message: "Client non trouvé" });
      }

      await ClientService.supprimerClient(id);

      return res.json({ message: "Client supprimé avec succès" });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: "Erreur lors de la suppression du client", error });
    }
  }
}

export default ClientController;
