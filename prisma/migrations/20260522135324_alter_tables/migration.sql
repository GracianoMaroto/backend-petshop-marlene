/*
  Warnings:

  - You are about to drop the column `notes` on the `customers` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `pets` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "customers" DROP COLUMN "notes";

-- AlterTable
ALTER TABLE "pets" DROP COLUMN "notes";
