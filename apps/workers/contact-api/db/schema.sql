-- CreateTable
CREATE TABLE "Contact" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT NOT NULL,
    "updatedAt" DATETIME,
    "updatedBy" TEXT,
    "reason" TEXT NOT NULL DEFAULT 'Other',
    "details" TEXT,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT,
    "firstName" TEXT,
    "lastName" TEXT,
    "addressLine1" TEXT,
    "addressLine2" TEXT,
    "postalCode" TEXT,
    "city" TEXT,
    "state" TEXT,
    "countryCode" TEXT,
    "title" TEXT,
    "companyName" TEXT,
    "url" TEXT,
    "storm_guard" BOOLEAN NOT NULL DEFAULT true,
    "storm_transaction" TEXT
);

-- CreateTable
CREATE TABLE "ContactAttachment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT NOT NULL,
    "updatedAt" DATETIME,
    "updatedBy" TEXT,
    "name" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Pending',
    "contactId" TEXT NOT NULL,
    "storm_guard" BOOLEAN NOT NULL DEFAULT true,
    "storm_transaction" TEXT,
    CONSTRAINT "ContactAttachment_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "Contact_storm_transaction_idx" ON "Contact"("storm_transaction");

-- CreateIndex
CREATE INDEX "ContactAttachment_storm_transaction_idx" ON "ContactAttachment"("storm_transaction");

-- CreateIndex
CREATE UNIQUE INDEX "ContactAttachment_name_path_key" ON "ContactAttachment"("name", "path");
