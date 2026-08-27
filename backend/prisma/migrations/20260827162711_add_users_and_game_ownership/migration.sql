/*
  Warnings:

  - Added the required column `userId` to the `games` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- Cria uma conta padrão para herdar os jogos já cadastrados antes de existir login.
-- Login: gamer_pro@example.com / senha: GamerPro123! (troque após o primeiro acesso).
INSERT INTO "users" ("id", "username", "email", "passwordHash", "createdAt", "updatedAt")
VALUES (
  'e6edb983-7397-45ff-a69b-168bdabc3247',
  'gamer_pro',
  'gamer_pro@example.com',
  '$2b$10$LdZzpRWjq6Ts9oHseRS8puLofxrplkNRcafkiFnfOZ37gen3SDjl.',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_games" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "developer" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "favorite" BOOLEAN NOT NULL DEFAULT false,
    "rating" REAL,
    "releaseDate" DATETIME,
    "coverUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "games_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_games" ("coverUrl", "createdAt", "developer", "favorite", "id", "platform", "rating", "releaseDate", "status", "title", "updatedAt", "userId") SELECT "coverUrl", "createdAt", "developer", "favorite", "id", "platform", "rating", "releaseDate", "status", "title", "updatedAt", 'e6edb983-7397-45ff-a69b-168bdabc3247' FROM "games";
DROP TABLE "games";
ALTER TABLE "new_games" RENAME TO "games";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
