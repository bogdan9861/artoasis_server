-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_PostTag" (
    "postId" TEXT NOT NULL,
    "tagId" INTEGER NOT NULL,

    PRIMARY KEY ("postId", "tagId"),
    CONSTRAINT "PostTag_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "PostTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_PostTag" ("postId", "tagId") SELECT "postId", "tagId" FROM "PostTag";
DROP TABLE "PostTag";
ALTER TABLE "new_PostTag" RENAME TO "PostTag";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
