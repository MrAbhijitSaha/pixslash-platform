-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_like" (
    "userId" TEXT NOT NULL,
    "wallpaperId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("userId", "wallpaperId"),
    CONSTRAINT "like_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "like_wallpaperId_fkey" FOREIGN KEY ("wallpaperId") REFERENCES "wallpaper" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_like" ("createdAt", "userId", "wallpaperId") SELECT "createdAt", "userId", "wallpaperId" FROM "like";
DROP TABLE "like";
ALTER TABLE "new_like" RENAME TO "like";
CREATE INDEX "like_wallpaperId_idx" ON "like"("wallpaperId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
