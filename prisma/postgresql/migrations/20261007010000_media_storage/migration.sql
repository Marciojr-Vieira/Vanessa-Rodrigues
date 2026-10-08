ALTER TABLE "MediaFile"
  ADD COLUMN "storageProvider" TEXT NOT NULL DEFAULT 'local',
  ADD COLUMN "storageBucket" TEXT,
  ADD COLUMN "objectKey" TEXT;
