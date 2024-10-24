/*
  Warnings:

  - A unique constraint covering the columns `[nom]` on the table `typeChambres` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "typeChambres_nom_key" ON "typeChambres"("nom");
