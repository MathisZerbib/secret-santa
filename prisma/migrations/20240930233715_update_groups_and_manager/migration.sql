-- AlterTable
ALTER TABLE "AppManager" ADD COLUMN     "hasPaid" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Gift" ADD COLUMN     "secretSantaGroupId" INTEGER;

-- AlterTable
ALTER TABLE "Recipient" ADD COLUMN     "secretSantaGroupId" INTEGER;

-- CreateTable
CREATE TABLE "SecretSantaGroup" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "inviteCode" TEXT NOT NULL,
    "managerId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SecretSantaGroup_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SecretSantaGroup_inviteCode_key" ON "SecretSantaGroup"("inviteCode");

-- AddForeignKey
ALTER TABLE "Gift" ADD CONSTRAINT "Gift_secretSantaGroupId_fkey" FOREIGN KEY ("secretSantaGroupId") REFERENCES "SecretSantaGroup"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recipient" ADD CONSTRAINT "Recipient_secretSantaGroupId_fkey" FOREIGN KEY ("secretSantaGroupId") REFERENCES "SecretSantaGroup"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SecretSantaGroup" ADD CONSTRAINT "SecretSantaGroup_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "AppManager"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
