-- AlterTable
ALTER TABLE `batdongsan` ALTER COLUMN `NgayTao` DROP DEFAULT,
    ALTER COLUMN `NgayCapNhat` DROP DEFAULT;

-- AlterTable
ALTER TABLE `giaodich` ALTER COLUMN `NgayTao` DROP DEFAULT;

-- AlterTable
ALTER TABLE `khachhang` ALTER COLUMN `NgayTao` DROP DEFAULT;
