/*
  Warnings:

  - You are about to drop the column `recoverPasswordCode` on the `NormalUser` table. All the data in the column will be lost.
  - You are about to drop the column `recoverPasswordCodeExpiresIn` on the `NormalUser` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "NormalUser" DROP COLUMN "recoverPasswordCode",
DROP COLUMN "recoverPasswordCodeExpiresIn",
ADD COLUMN     "recoveryPasswordCode" TEXT,
ADD COLUMN     "recoveryPasswordCodeExpiresIn" TIMESTAMP(3);
