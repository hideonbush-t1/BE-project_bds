CREATE TABLE `batdongsan` (
  `MaBDS` varchar(20) NOT NULL,
  `MaKH` varchar(20) NOT NULL,
  `NhuCau` varchar(50) DEFAULT NULL,
  `TieuDe` varchar(255) DEFAULT NULL,
  `LoaiBDS` varchar(50) NOT NULL,
  `DiaChi` varchar(100) NOT NULL,
  `DienTich` float NOT NULL,
  `GiaTien` decimal(15,2) NOT NULL,
  `TinhTrang` varchar(50) NOT NULL,
  `IsDeleted` tinyint(1) DEFAULT 0,
  `NgayTao` datetime DEFAULT current_timestamp(),
  `NgayCapNhat` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `ViTri` varchar(100) DEFAULT NULL,
  `Huong` varchar(50) DEFAULT NULL,
  `GhiChu` varchar(1000) DEFAULT NULL,
  PRIMARY KEY (`MaBDS`),
  KEY `FK_BDS_KH` (`MaKH`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `chitietbds` (
  `MaBDS` varchar(20) NOT NULL,
  `ViTri` varchar(50) DEFAULT NULL,
  `Huong` varchar(20) DEFAULT NULL,
  `SoPhongNgu` int(11) DEFAULT NULL,
  `SoToilet` int(11) DEFAULT NULL,
  `SoTang` int(11) DEFAULT NULL,
  `MatTien` float DEFAULT NULL,
  `DuongVao` float DEFAULT NULL,
  `PhapLy` varchar(100) DEFAULT NULL,
  `MoTa` varchar(1000) DEFAULT NULL,
  `GhiChu` varchar(1000) DEFAULT NULL,
  PRIMARY KEY (`MaBDS`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `giaodich` (
  `MaGD` varchar(20) NOT NULL,
  `MaNVGD` varchar(5) NOT NULL,
  `BenMua` varchar(20) NOT NULL,
  `BenBan` varchar(100) DEFAULT NULL,
  `MaBDS` varchar(20) NOT NULL,
  `SoTien` decimal(15,2) NOT NULL,
  `NgayGD` date NOT NULL,
  `TyLeHoaHong` float NOT NULL,
  `MoTaGD` varchar(1000) DEFAULT NULL,
  `TinhTrang` varchar(50) NOT NULL,
  `IsDeleted` tinyint(1) DEFAULT 0,
  `NgayTao` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`MaGD`),
  KEY `FK_GD_KH` (`BenMua`),
  KEY `FK_GD_BDS` (`MaBDS`),
  KEY `FK_GD_NV` (`MaNVGD`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `hinhanhbds` (
  `MaHinhAnh` int(11) NOT NULL AUTO_INCREMENT,
  `MaBDS` varchar(20) NOT NULL,
  `DuongDan` varchar(255) NOT NULL,
  `AnhDaiDien` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`MaHinhAnh`),
  KEY `FK_HINHANH_BDS` (`MaBDS`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `khachhang` (
  `MaKH` varchar(20) NOT NULL,
  `LoaiKH` varchar(20) NOT NULL,
  `TenKH` varchar(50) NOT NULL,
  `GioiTinh` varchar(10) NOT NULL,
  `NgaySinh` date NOT NULL,
  `DiaChi` varchar(100) NOT NULL,
  `SoDienThoai` varchar(12) NOT NULL,
  `Email` varchar(50) DEFAULT NULL,
  `MaNVQL` varchar(5) DEFAULT NULL,
  `IsDeleted` tinyint(1) DEFAULT 0,
  `NgayTao` datetime DEFAULT current_timestamp(),
  `SoCMND` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`MaKH`),
  KEY `FK_KH_NV` (`MaNVQL`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `nhanvien` (
  `MaNV` varchar(5) NOT NULL,
  `MatKhau` varchar(255) NOT NULL,
  `TenNV` varchar(45) NOT NULL,
  `DiaChi` varchar(100) NOT NULL,
  `GioiTinh` varchar(10) NOT NULL,
  `NgaySinh` date NOT NULL,
  `ChucVu` varchar(50) NOT NULL,
  `SoDienThoai` varchar(12) NOT NULL,
  `Email` varchar(50) NOT NULL,
  `Admin` varchar(20) NOT NULL,
  `TenDangNhap` varchar(50) DEFAULT NULL,
  `AnhDaiDien` varchar(255) DEFAULT NULL,
  `IsDeleted` tinyint(1) DEFAULT 0,
  `NgayTao` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`MaNV`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `nhucau` (
  `MaNC` varchar(20) NOT NULL,
  `MaKH` varchar(20) NOT NULL,
  `LoaiNC` varchar(50) NOT NULL,
  `LoaiBDS` varchar(50) NOT NULL,
  `ViTri` varchar(100) NOT NULL,
  `DienTichMin` float DEFAULT NULL,
  `DienTichMax` float DEFAULT NULL,
  `GhiChu` varchar(255) DEFAULT NULL,
  `IsDeleted` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`MaNC`),
  KEY `FK_NC_KH` (`MaKH`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `thongbao` (
  `MaTB` int(11) NOT NULL AUTO_INCREMENT,
  `TenTB` varchar(255) NOT NULL,
  `NoiDungTB` varchar(1000) NOT NULL,
  `Ngay` date NOT NULL,
  `MaNV` varchar(5) DEFAULT NULL,
  `IsDeleted` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`MaTB`),
  KEY `FK_TB_NV` (`MaNV`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

ALTER TABLE `batdongsan`
  ADD CONSTRAINT `FK_BDS_KH` FOREIGN KEY (`MaKH`) REFERENCES `khachhang` (`MaKH`) ON DELETE CASCADE;

ALTER TABLE `chitietbds`
  ADD CONSTRAINT `FK_CTBDS_BDS` FOREIGN KEY (`MaBDS`) REFERENCES `batdongsan` (`MaBDS`) ON DELETE CASCADE;

ALTER TABLE `giaodich`
  ADD CONSTRAINT `FK_GD_BDS` FOREIGN KEY (`MaBDS`) REFERENCES `batdongsan` (`MaBDS`),
  ADD CONSTRAINT `FK_GD_KH` FOREIGN KEY (`BenMua`) REFERENCES `khachhang` (`MaKH`),
  ADD CONSTRAINT `FK_GD_NV` FOREIGN KEY (`MaNVGD`) REFERENCES `nhanvien` (`MaNV`);

ALTER TABLE `hinhanhbds`
  ADD CONSTRAINT `FK_HINHANH_BDS` FOREIGN KEY (`MaBDS`) REFERENCES `batdongsan` (`MaBDS`) ON DELETE CASCADE;

ALTER TABLE `khachhang`
  ADD CONSTRAINT `FK_KH_NV` FOREIGN KEY (`MaNVQL`) REFERENCES `nhanvien` (`MaNV`) ON DELETE SET NULL;

ALTER TABLE `nhucau`
  ADD CONSTRAINT `FK_NC_KH` FOREIGN KEY (`MaKH`) REFERENCES `khachhang` (`MaKH`) ON DELETE CASCADE;

ALTER TABLE `thongbao`
  ADD CONSTRAINT `FK_TB_NV` FOREIGN KEY (`MaNV`) REFERENCES `nhanvien` (`MaNV`);