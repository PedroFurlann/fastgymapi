/*
  Warnings:

  - The `dayOfWeek` column on the `Exercise` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `category` on the `Exercise` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Exercise" DROP COLUMN "category",
ADD COLUMN     "category" TEXT NOT NULL,
DROP COLUMN "dayOfWeek",
ADD COLUMN     "dayOfWeek" TEXT;
