-- AlterTable
ALTER TABLE "User" ADD COLUMN     "appManagerId" INTEGER;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_appManagerId_fkey" FOREIGN KEY ("appManagerId") REFERENCES "AppManager"("id") ON DELETE SET NULL ON UPDATE CASCADE;
