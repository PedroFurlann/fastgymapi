-- AlterTable
ALTER TABLE "Exercise" ADD COLUMN     "normalUserId" TEXT;

-- CreateTable
CREATE TABLE "NormalUser" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "avatarUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "NormalUser_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "NormalUser_email_key" ON "NormalUser"("email");

-- AddForeignKey
ALTER TABLE "Exercise" ADD CONSTRAINT "Exercise_normalUserId_fkey" FOREIGN KEY ("normalUserId") REFERENCES "NormalUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;
