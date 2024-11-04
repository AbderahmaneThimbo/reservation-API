import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import prisma from "../config/prisma.js";
import nodemailer from "nodemailer";
import i18next from "../i18nextConfig.js";

const router = express.Router();

router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  try {
    const utilisateur = await prisma.utilisateur.findUnique({
      where: { email }
    });

    if (!utilisateur) {
      return res.status(404).json({ message: i18next.t("user.notFound") });
    }

    const token = jwt.sign(
      { utilisateurId: utilisateur.id },
      process.env.JWT_RESET_PASSWORD_SECRET,
      { expiresIn: "2h" }
    );

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });

    await transporter.sendMail({
      to: utilisateur.email,
      subject: "Réinitialisation du mot de passe",
      html: `<p>Réinitialisez votre mot de passe en cliquant sur le lien suivant :</p>
             <a href="${resetUrl}">${resetUrl}</a>`
    });

    res
      .status(200)
      .json({ message: i18next.t("forget.passwordResetEmailSent") });
  } catch (error) {
    res
      .status(500)
      .json({ message: i18next.t("forgeterror.generalError"), error });
  }
});

router.post("/reset-password/:token", async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_RESET_PASSWORD_SECRET);

    const utilisateur = await prisma.utilisateur.findUnique({
      where: { id: decoded.utilisateurId }
    });

    if (!utilisateur) {
      return res.status(404).json({ message: i18next.t("forget.notFound") });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.utilisateur.update({
      where: { id: utilisateur.id },
      data: { password: hashedPassword }
    });

    res
      .status(200)
      .json({ message: i18next.t("forget.passwordUpdatedSuccessfully") });
  } catch (error) {
    res
      .status(400)
      .json({ message: i18next.t("forgeterror.invalidOrExpiredToken"), error });
  }
});

export default router;
