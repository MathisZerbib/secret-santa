-- CreateTable
CREATE TABLE "AppManager" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "token" TEXT NOT NULL,

    CONSTRAINT "AppManager_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AppManager_email_key" ON "AppManager"("email");

-- CreateIndex
CREATE UNIQUE INDEX "AppManager_token_key" ON "AppManager"("token");
