-- AlterTable
ALTER TABLE `Users` ADD COLUMN `resetToken` TEXT NULL,
    ADD COLUMN `resetTokenExpiry` DATETIME(3) NULL;
