/*
  Warnings:

  - You are about to drop the column `favorite` on the `History` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "History" DROP COLUMN "favorite",
ADD COLUMN     "workoutFavorite" BOOLEAN NOT NULL DEFAULT false;
