-- CreateTable
CREATE TABLE "Contact" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    "createdBy" INTEGER NOT NULL,
    "updatedBy" INTEGER,
    "reason" TEXT NOT NULL,
    "details" TEXT,
    "emailId" INTEGER NOT NULL,
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
    CONSTRAINT "Contact_emailId_fkey" FOREIGN KEY ("emailId") REFERENCES "ContactEmail" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ContactEmail" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    "createdBy" INTEGER NOT NULL,
    "updatedBy" INTEGER,
    "email" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "ContactAttachment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    "createdBy" INTEGER NOT NULL,
    "updatedBy" INTEGER,
    "name" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "contactId" INTEGER NOT NULL,
    CONSTRAINT "ContactAttachment_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "ContactEmail_email_key" ON "ContactEmail"("email");

-- CreateIndex
CREATE UNIQUE INDEX "ContactAttachment_name_path_key" ON "ContactAttachment"("name", "path");
