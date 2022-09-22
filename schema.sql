CREATE TABLE IF NOT EXISTS `account` (
    `account_uuid` CHAR(36) NOT NULL DEFAULT (uuid()),
    `email` VARCHAR(255) NOT NULL UNIQUE,
    `password` VARCHAR(255) NOT NULL,
    `role` ENUM("admin", "user") DEFAULT "user",
    `created_at` DATETIME NOT NULL DEFAULT NOW(),
    `updated_at` DATETIME NOT NULL DEFAULT NOW() ON UPDATE NOW(),
    PRIMARY KEY (`account_uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `token` (
    `token_uuid` CHAR(36) NOT NULL DEFAULT (uuid()),
    `account_uuid` CHAR(36) NOT NULL,
    `token` VARCHAR(255) NOT NULL,
    `expires_at` DATETIME NOT NULL,
    PRIMARY KEY (`token_uuid`),
    FOREIGN KEY (`account_uuid`) REFERENCES account(`account_uuid`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;