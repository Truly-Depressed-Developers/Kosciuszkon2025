-- CreateTable
CREATE TABLE "Producents" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "link" TEXT NOT NULL,

    CONSTRAINT "Producents_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Producents_name_key" ON "Producents"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Producents_link_key" ON "Producents"("link");
