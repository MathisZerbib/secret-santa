/*
  Warnings:

  - You are about to drop the column `recipient` on the `Gift` table. All the data in the column will be lost.
  - Added the required column `recipientId` to the `Gift` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Gift" DROP COLUMN "recipient",
ADD COLUMN     "link" TEXT,
ADD COLUMN     "recipientId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Recipient" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Recipient_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Gift" ADD CONSTRAINT "Gift_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "Recipient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
