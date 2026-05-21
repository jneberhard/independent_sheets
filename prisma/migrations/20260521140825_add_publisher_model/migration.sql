-- CreateTable
CREATE TABLE "Publisher" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "addressLine1" TEXT NOT NULL,
    "addressLine2" TEXT,
    "city" TEXT NOT NULL,
    "stateProvince" TEXT NOT NULL,
    "postalCode" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "phoneNumber" TEXT,
    "biography" TEXT,
    "websiteUrl" TEXT,
    "youtubeUrl" TEXT,
    "spotifyUrl" TEXT,
    "primaryCategories" TEXT,
    "primaryVoicings" TEXT,
    "uploadingOriginalWorks" BOOLEAN NOT NULL,
    "uploadingArrangements" BOOLEAN NOT NULL,
    "ownsOrControlsRights" BOOLEAN NOT NULL,
    "acceptedAgreement" BOOLEAN NOT NULL,
    "paypalEmail" TEXT,
    "preferredPaymentMethod" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Publisher_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Publisher_userId_key" ON "Publisher"("userId");

-- AddForeignKey
ALTER TABLE "Publisher" ADD CONSTRAINT "Publisher_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
