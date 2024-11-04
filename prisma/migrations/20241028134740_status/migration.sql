-- CreateEnum
CREATE TYPE "ReservationStatus" AS ENUM ('EN_ATTENTE', 'CONFIRMEE');

-- AlterTable
ALTER TABLE "reservations" ADD COLUMN     "status" "ReservationStatus" NOT NULL DEFAULT 'EN_ATTENTE';
