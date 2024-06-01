/*
  Warnings:

  - You are about to drop the column `videoUrl` on the `Exercise` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Exercise" DROP COLUMN "videoUrl",
ADD COLUMN     "mediaUrl" TEXT;
