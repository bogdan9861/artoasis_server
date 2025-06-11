/*
  Warnings:

  - The primary key for the `items` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_items" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "inventarization_code" TEXT NOT NULL,
    "photo_url" TEXT,
    "upload_date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_items" ("id", "inventarization_code", "name", "photo_url", "upload_date") SELECT "id", "inventarization_code", "name", "photo_url", "upload_date" FROM "items";
DROP TABLE "items";
ALTER TABLE "new_items" RENAME TO "items";
CREATE UNIQUE INDEX "items_inventarization_code_key" ON "items"("inventarization_code");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
