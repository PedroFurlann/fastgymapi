-- AlterTable
ALTER TABLE "NormalUser" ADD COLUMN     "recoverPasswordCode" TEXT,
ADD COLUMN     "recoverPasswordCodeExpiresIn" TIMESTAMP(3);
