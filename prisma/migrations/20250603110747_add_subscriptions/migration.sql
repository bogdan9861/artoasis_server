-- AlterTable
ALTER TABLE "users" ADD COLUMN "Exhibitions" TEXT;
ALTER TABLE "users" ADD COLUMN "banner" TEXT;
ALTER TABLE "users" ADD COLUMN "bio" TEXT;

-- CreateTable
CREATE TABLE "Subscription" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "subscriberId" INTEGER NOT NULL,
    "subscribedToId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Subscription_subscriberId_fkey" FOREIGN KEY ("subscriberId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Subscription_subscribedToId_fkey" FOREIGN KEY ("subscribedToId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Post" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" INTEGER,
    "title" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "media" TEXT,
    "mediaType" TEXT,
    "rating" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "Post_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Post" ("date", "id", "media", "mediaType", "rating", "text", "title", "userId") SELECT "date", "id", "media", "mediaType", "rating", "text", "title", "userId" FROM "Post";
DROP TABLE "Post";
ALTER TABLE "new_Post" RENAME TO "Post";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_subscriberId_subscribedToId_key" ON "Subscription"("subscriberId", "subscribedToId");
