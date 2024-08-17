/*
  Warnings:

  - Added the required column `customer_name` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `customer_phone` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Order" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "customer_phone" TEXT NOT NULL,
    "customer_email" TEXT,
    "customer_name" TEXT NOT NULL,
    "status" TEXT NOT NULL
);
INSERT INTO "new_Order" ("created_at", "id", "status") SELECT "created_at", "id", "status" FROM "Order";
DROP TABLE "Order";
ALTER TABLE "new_Order" RENAME TO "Order";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
