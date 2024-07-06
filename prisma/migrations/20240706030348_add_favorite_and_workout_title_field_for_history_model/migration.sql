/*
  Warnings:

  - Added the required column `workoutTitle` to the `History` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "History" ADD COLUMN     "favorite" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "workoutTitle" TEXT NOT NULL;
