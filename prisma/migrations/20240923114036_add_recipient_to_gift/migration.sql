-- CreateTable
CREATE TABLE "Gift" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "recipient" TEXT NOT NULL,
    "bought" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Gift_pkey" PRIMARY KEY ("id")
);
