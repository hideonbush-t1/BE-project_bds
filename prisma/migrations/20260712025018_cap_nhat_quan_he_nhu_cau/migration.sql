-- AlterTable
ALTER TABLE `nhucau` ADD COLUMN `nhanVienId` VARCHAR(191) NULL;

-- CreateIndex
CREATE INDEX `Idx_LoaiBDS` ON `batdongsan`(`LoaiBDS`);

-- CreateIndex
CREATE INDEX `Idx_ViTri` ON `batdongsan`(`ViTri`);

-- CreateIndex
CREATE INDEX `Idx_DiaChi` ON `batdongsan`(`DiaChi`);

-- CreateIndex
CREATE INDEX `Idx_GiaTien` ON `batdongsan`(`GiaTien`);

-- CreateIndex
CREATE INDEX `Idx_Huong` ON `batdongsan`(`Huong`);

-- CreateIndex
CREATE INDEX `Idx_BoLoc_Loai_ViTri_Gia` ON `batdongsan`(`LoaiBDS`, `ViTri`, `GiaTien`);

-- AddForeignKey
ALTER TABLE `NhuCau` ADD CONSTRAINT `NhuCau_nhanVienId_fkey` FOREIGN KEY (`nhanVienId`) REFERENCES `nhanvien`(`MaNV`) ON DELETE SET NULL ON UPDATE CASCADE;
