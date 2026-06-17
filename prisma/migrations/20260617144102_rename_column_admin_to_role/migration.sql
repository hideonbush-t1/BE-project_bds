/*
  Warnings:

  - You are about to drop the column `Admin` on the `nhanvien` table. All the data in the column will be lost.
  - Added the required column `Role` to the `nhanvien` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `batdongsan` DROP FOREIGN KEY `FK_BDS_KH`;

-- DropForeignKey
ALTER TABLE `chitietbds` DROP FOREIGN KEY `FK_CTBDS_BDS`;

-- DropForeignKey
ALTER TABLE `hinhanhbds` DROP FOREIGN KEY `FK_HINHANH_BDS`;

-- DropForeignKey
ALTER TABLE `khachhang` DROP FOREIGN KEY `FK_KH_NV`;

-- DropForeignKey
ALTER TABLE `nhucau` DROP FOREIGN KEY `FK_NC_KH`;

-- AlterTable
ALTER TABLE `batdongsan` ALTER COLUMN `NgayTao` DROP DEFAULT,
    ALTER COLUMN `NgayCapNhat` DROP DEFAULT,
    MODIFY `GhiChu` LONGTEXT NULL;

-- AlterTable
ALTER TABLE `chitietbds` MODIFY `MoTa` LONGTEXT NULL,
    MODIFY `GhiChu` LONGTEXT NULL;

-- AlterTable
ALTER TABLE `giaodich` MODIFY `MoTaGD` LONGTEXT NULL,
    ALTER COLUMN `NgayTao` DROP DEFAULT;

-- AlterTable
ALTER TABLE `hinhanhbds` MODIFY `MaHinhAnh` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `khachhang` ALTER COLUMN `NgayTao` DROP DEFAULT;

-- AlterTable
ALTER TABLE `nhanvien` DROP COLUMN `Admin`,
    ADD COLUMN `Role` VARCHAR(20) NOT NULL;

-- AlterTable
ALTER TABLE `thongbao` MODIFY `NoiDungTB` LONGTEXT NOT NULL;

-- CreateTable
CREATE TABLE `hosobieumau` (
    `MaHoSo` INTEGER NOT NULL AUTO_INCREMENT,
    `TenHoSo` VARCHAR(150) NOT NULL,
    `NoiDung` LONGTEXT NULL,
    `DuongDan` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`MaHoSo`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `khachhang` ADD CONSTRAINT `khachhang_ibfk_1` FOREIGN KEY (`MaNVQL`) REFERENCES `nhanvien`(`MaNV`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `nhucau` ADD CONSTRAINT `FK_NC_KH` FOREIGN KEY (`MaKH`) REFERENCES `khachhang`(`MaKH`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `batdongsan` ADD CONSTRAINT `FK_BDS_KH` FOREIGN KEY (`MaKH`) REFERENCES `khachhang`(`MaKH`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `chitietbds` ADD CONSTRAINT `FK_CTBDS_BDS` FOREIGN KEY (`MaBDS`) REFERENCES `batdongsan`(`MaBDS`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `hinhanhbds` ADD CONSTRAINT `FK_HINHANH_BDS` FOREIGN KEY (`MaBDS`) REFERENCES `batdongsan`(`MaBDS`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- RedefineIndex
CREATE INDEX `MaKH` ON `batdongsan`(`MaKH`);
DROP INDEX `FK_BDS_KH` ON `batdongsan`;

-- RedefineIndex
CREATE INDEX `MaBDS` ON `giaodich`(`MaBDS`);
DROP INDEX `FK_GD_BDS` ON `giaodich`;

-- RedefineIndex
CREATE INDEX `BenMua` ON `giaodich`(`BenMua`);
DROP INDEX `FK_GD_KH` ON `giaodich`;

-- RedefineIndex
CREATE INDEX `MaNVGD` ON `giaodich`(`MaNVGD`);
DROP INDEX `FK_GD_NV` ON `giaodich`;

-- RedefineIndex
CREATE INDEX `MaBDS` ON `hinhanhbds`(`MaBDS`);
DROP INDEX `FK_HINHANH_BDS` ON `hinhanhbds`;

-- RedefineIndex
CREATE INDEX `MaNVQL` ON `khachhang`(`MaNVQL`);
DROP INDEX `FK_KH_NV` ON `khachhang`;

-- RedefineIndex
CREATE INDEX `MaKH` ON `nhucau`(`MaKH`);
DROP INDEX `FK_NC_KH` ON `nhucau`;

-- RedefineIndex
CREATE INDEX `MaNV` ON `thongbao`(`MaNV`);
DROP INDEX `FK_TB_NV` ON `thongbao`;
