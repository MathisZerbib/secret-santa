/*
  Warnings:

  - Added the required column `email` to the `Recipient` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Recipient" ADD COLUMN     "email" TEXT NOT NULL;
