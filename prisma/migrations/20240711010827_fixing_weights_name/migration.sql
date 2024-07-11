/*
  Warnings:

  - You are about to drop the column `weigths` on the `Exercise` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Exercise" DROP COLUMN "weigths",
ADD COLUMN     "weights" INTEGER[];
