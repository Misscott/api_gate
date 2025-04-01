-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 01-04-2025 a las 17:41:24
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `mydb`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `devices`
--

CREATE TABLE `devices` (
  `id` bigint(20) NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `serial_number` varchar(255) NOT NULL,
  `model` varchar(255) NOT NULL,
  `brand` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `createdBy` varchar(255) DEFAULT NULL,
  `deleted` datetime DEFAULT NULL,
  `deletedBy` varchar(255) DEFAULT NULL,
  `created` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Volcado de datos para la tabla `devices`
--

INSERT INTO `devices` (`id`, `uuid`, `serial_number`, `model`, `brand`, `description`, `createdBy`, `deleted`, `deletedBy`, `created`) VALUES
(1, '927a5436-0ed5-11f0-8154-bce92f8462b5', 'SN001', 'Laptop X1', 'TechBrand', 'High performance laptop', 'system', NULL, NULL, '2025-04-01 10:44:49'),
(2, '927a6280-0ed5-11f0-8154-bce92f8462b5', 'SN002', 'Smartphone S22', 'MobileTech', 'Latest smartphone model', 'system', NULL, NULL, '2025-04-01 10:44:49'),
(3, '927a6306-0ed5-11f0-8154-bce92f8462b5', 'SN003', 'Tablet Pro', 'TabletCo', 'Professional tablet for designers', 'system', NULL, NULL, '2025-04-01 10:44:49');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `endpoints`
--

CREATE TABLE `endpoints` (
  `id` bigint(20) NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `route` varchar(255) NOT NULL,
  `created` datetime NOT NULL DEFAULT current_timestamp(),
  `createdBy` varchar(255) DEFAULT NULL,
  `deleted` datetime DEFAULT NULL,
  `deletedBy` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `permissions`
--

CREATE TABLE `permissions` (
  `id` bigint(20) NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `action` enum('GET','POST','PUT','DELETE') NOT NULL,
  `created` datetime NOT NULL DEFAULT current_timestamp(),
  `createdBy` varchar(255) DEFAULT NULL,
  `deleted` datetime DEFAULT NULL,
  `deletedBy` varchar(255) DEFAULT NULL,
  `fk_endpoint` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Volcado de datos para la tabla `permissions`
--

INSERT INTO `permissions` (`id`, `uuid`, `action`, `created`, `createdBy`, `deleted`, `deletedBy`, `fk_endpoint`) VALUES
(1, '926cd785-0ed5-11f0-8154-bce92f8462b5', 'GET', '2025-04-01 10:44:49', 'system', NULL, NULL, 0),
(2, '926ce6b4-0ed5-11f0-8154-bce92f8462b5', 'POST', '2025-04-01 10:44:49', 'system', NULL, NULL, 0),
(3, '926ce794-0ed5-11f0-8154-bce92f8462b5', 'PUT', '2025-04-01 10:44:49', 'system', NULL, NULL, 0),
(4, '926ce7d5-0ed5-11f0-8154-bce92f8462b5', 'DELETE', '2025-04-01 10:44:49', 'system', NULL, NULL, 0),
(5, '926ce809-0ed5-11f0-8154-bce92f8462b5', 'GET', '2025-04-01 10:44:49', 'system', NULL, NULL, 0),
(6, '926ce83b-0ed5-11f0-8154-bce92f8462b5', 'POST', '2025-04-01 10:44:49', 'system', NULL, NULL, 0),
(7, '926ce866-0ed5-11f0-8154-bce92f8462b5', 'PUT', '2025-04-01 10:44:49', 'system', NULL, NULL, 0),
(8, '926ce890-0ed5-11f0-8154-bce92f8462b5', 'DELETE', '2025-04-01 10:44:49', 'system', NULL, NULL, 0),
(9, '926ce906-0ed5-11f0-8154-bce92f8462b5', 'GET', '2025-04-01 10:44:49', 'system', NULL, NULL, 0),
(10, '926ce936-0ed5-11f0-8154-bce92f8462b5', 'POST', '2025-04-01 10:44:49', 'system', NULL, NULL, 0),
(11, '926ce966-0ed5-11f0-8154-bce92f8462b5', 'PUT', '2025-04-01 10:44:49', 'system', NULL, NULL, 0),
(12, '926ce9ca-0ed5-11f0-8154-bce92f8462b5', 'DELETE', '2025-04-01 10:44:49', 'system', NULL, NULL, 0),
(13, '926ce9f6-0ed5-11f0-8154-bce92f8462b5', 'GET', '2025-04-01 10:44:49', 'system', NULL, NULL, 0),
(14, '926cea20-0ed5-11f0-8154-bce92f8462b5', 'POST', '2025-04-01 10:44:49', 'system', NULL, NULL, 0),
(15, '926cea4c-0ed5-11f0-8154-bce92f8462b5', 'PUT', '2025-04-01 10:44:49', 'system', NULL, NULL, 0),
(16, '926cea78-0ed5-11f0-8154-bce92f8462b5', 'DELETE', '2025-04-01 10:44:49', 'system', NULL, NULL, 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `roles`
--

CREATE TABLE `roles` (
  `id` bigint(20) NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `created` datetime NOT NULL DEFAULT current_timestamp(),
  `createdBy` varchar(255) DEFAULT NULL,
  `deleted` datetime DEFAULT NULL,
  `deletedBy` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Volcado de datos para la tabla `roles`
--

INSERT INTO `roles` (`id`, `uuid`, `name`, `created`, `createdBy`, `deleted`, `deletedBy`) VALUES
(1, '92691396-0ed5-11f0-8154-bce92f8462b5', 'admin', '2025-04-01 10:44:49', 'system', NULL, NULL),
(2, '92692470-0ed5-11f0-8154-bce92f8462b5', 'viewer', '2025-04-01 10:44:49', 'system', NULL, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `roles_has_permissions`
--

CREATE TABLE `roles_has_permissions` (
  `id` bigint(20) NOT NULL,
  `fk_role` bigint(20) NOT NULL,
  `fk_permission` bigint(20) NOT NULL,
  `created` datetime NOT NULL DEFAULT current_timestamp(),
  `createdBy` varchar(255) DEFAULT NULL,
  `deleted` datetime DEFAULT NULL,
  `deletedBy` varchar(255) DEFAULT NULL,
  `uuid` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Volcado de datos para la tabla `roles_has_permissions`
--

INSERT INTO `roles_has_permissions` (`id`, `fk_role`, `fk_permission`, `created`, `createdBy`, `deleted`, `deletedBy`, `uuid`) VALUES
(1, 1, 1, '2025-04-01 10:44:49', 'system', NULL, NULL, '927292b2-0ed5-11f0-8154-bce92f8462b5'),
(2, 1, 2, '2025-04-01 10:44:49', 'system', NULL, NULL, '9272a176-0ed5-11f0-8154-bce92f8462b5'),
(3, 1, 3, '2025-04-01 10:44:49', 'system', NULL, NULL, '9272a23e-0ed5-11f0-8154-bce92f8462b5'),
(4, 1, 4, '2025-04-01 10:44:49', 'system', NULL, NULL, '9272a35d-0ed5-11f0-8154-bce92f8462b5'),
(5, 1, 5, '2025-04-01 10:44:49', 'system', NULL, NULL, '9272a3c1-0ed5-11f0-8154-bce92f8462b5'),
(6, 1, 6, '2025-04-01 10:44:49', 'system', NULL, NULL, '9272a41e-0ed5-11f0-8154-bce92f8462b5'),
(7, 1, 7, '2025-04-01 10:44:49', 'system', NULL, NULL, '9272a473-0ed5-11f0-8154-bce92f8462b5'),
(8, 1, 8, '2025-04-01 10:44:49', 'system', NULL, NULL, '9272a547-0ed5-11f0-8154-bce92f8462b5'),
(9, 1, 9, '2025-04-01 10:44:49', 'system', NULL, NULL, '9272a5f1-0ed5-11f0-8154-bce92f8462b5'),
(10, 1, 10, '2025-04-01 10:44:49', 'system', NULL, NULL, '9272a644-0ed5-11f0-8154-bce92f8462b5'),
(11, 1, 11, '2025-04-01 10:44:49', 'system', NULL, NULL, '9272a690-0ed5-11f0-8154-bce92f8462b5'),
(12, 1, 12, '2025-04-01 10:44:49', 'system', NULL, NULL, '9272a6f6-0ed5-11f0-8154-bce92f8462b5'),
(13, 1, 13, '2025-04-01 10:44:49', 'system', NULL, NULL, '9272a748-0ed5-11f0-8154-bce92f8462b5'),
(14, 1, 14, '2025-04-01 10:44:49', 'system', NULL, NULL, '9272a795-0ed5-11f0-8154-bce92f8462b5'),
(15, 1, 15, '2025-04-01 10:44:49', 'system', NULL, NULL, '9272a7e3-0ed5-11f0-8154-bce92f8462b5'),
(16, 1, 16, '2025-04-01 10:44:49', 'system', NULL, NULL, '9272a82e-0ed5-11f0-8154-bce92f8462b5'),
(32, 2, 1, '2025-04-01 10:44:49', 'system', NULL, NULL, '92747663-0ed5-11f0-8154-bce92f8462b5'),
(33, 2, 5, '2025-04-01 10:44:49', 'system', NULL, NULL, '92748409-0ed5-11f0-8154-bce92f8462b5'),
(34, 2, 9, '2025-04-01 10:44:49', 'system', NULL, NULL, '927484ab-0ed5-11f0-8154-bce92f8462b5'),
(35, 2, 13, '2025-04-01 10:44:49', 'system', NULL, NULL, '9274850f-0ed5-11f0-8154-bce92f8462b5');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE `users` (
  `username` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `id` bigint(20) NOT NULL,
  `fk_role` bigint(20) NOT NULL,
  `created` datetime NOT NULL DEFAULT current_timestamp(),
  `createdBy` varchar(255) DEFAULT NULL,
  `deleted` datetime DEFAULT NULL,
  `deletedBy` varchar(255) DEFAULT NULL,
  `status` varchar(45) DEFAULT NULL,
  `lastLoginDate` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`username`, `email`, `password`, `uuid`, `id`, `fk_role`, `created`, `createdBy`, `deleted`, `deletedBy`, `status`, `lastLoginDate`) VALUES
('admin', 'admin@example.com', '749f09bade8aca755660eeb17792da880218d4fbdc4e25fbec279d7fe9f65d70', '927658d5-0ed5-11f0-8154-bce92f8462b5', 1, 1, '2025-04-01 10:44:49', 'system', NULL, NULL, 'active', NULL),
('viewer', 'viewer@example.com', '139f268dcb46dc0c1677f259fe231cb6fe9e1394116ae66cb85690b857f276c9', '92784a8a-0ed5-11f0-8154-bce92f8462b5', 2, 2, '2025-04-01 10:44:49', 'system', NULL, NULL, 'active', NULL),
('admin_user', 'admin@example.com', '$2b$12$VGJZSRyzzKPNRapXvVpFGu7dINaCASCLhalvecda3nM5ZHX2oisHu', '00f6f64a-0ee1-11f0-8154-bce92f8462b5', 3, 1, '2025-03-31 12:06:39', 'system', NULL, NULL, 'active', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users_has_devices`
--

CREATE TABLE `users_has_devices` (
  `id` bigint(20) NOT NULL,
  `fk_device` bigint(20) NOT NULL,
  `fk_user` bigint(20) NOT NULL,
  `stock` int(11) NOT NULL,
  `created` datetime NOT NULL DEFAULT current_timestamp(),
  `createdBy` varchar(255) DEFAULT NULL,
  `deleted` datetime DEFAULT NULL,
  `deletedBy` varchar(255) DEFAULT NULL,
  `uuid` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Volcado de datos para la tabla `users_has_devices`
--

INSERT INTO `users_has_devices` (`id`, `fk_device`, `fk_user`, `stock`, `created`, `createdBy`, `deleted`, `deletedBy`, `uuid`) VALUES
(1, 1, 1, 5, '2025-04-01 10:44:49', 'system', NULL, NULL, '92856094-0ed5-11f0-8154-bce92f8462b5'),
(2, 2, 1, 3, '2025-04-01 10:44:49', 'system', NULL, NULL, '92856c33-0ed5-11f0-8154-bce92f8462b5'),
(3, 3, 2, 2, '2025-04-01 10:44:49', 'system', NULL, NULL, '92856d01-0ed5-11f0-8154-bce92f8462b5');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `devices`
--
ALTER TABLE `devices`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uuid_UNIQUE` (`uuid`);

--
-- Indices de la tabla `endpoints`
--
ALTER TABLE `endpoints`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uuid_UNIQUE` (`uuid`);

--
-- Indices de la tabla `permissions`
--
ALTER TABLE `permissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uuid_UNIQUE` (`uuid`),
  ADD KEY `fk_permissions_endpoints1_idx` (`fk_endpoint`);

--
-- Indices de la tabla `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uuid_UNIQUE` (`uuid`),
  ADD UNIQUE KEY `name_UNIQUE` (`name`);

--
-- Indices de la tabla `roles_has_permissions`
--
ALTER TABLE `roles_has_permissions`
  ADD PRIMARY KEY (`id`,`fk_role`,`fk_permission`),
  ADD UNIQUE KEY `uuid_UNIQUE` (`uuid`),
  ADD KEY `fk_roles_has_permissions_permissions1_idx` (`fk_permission`),
  ADD KEY `fk_roles_has_permissions_roles1_idx` (`fk_role`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uuid_UNIQUE` (`uuid`),
  ADD UNIQUE KEY `username_UNIQUE` (`username`),
  ADD KEY `fk_user_roles1_idx` (`fk_role`);

--
-- Indices de la tabla `users_has_devices`
--
ALTER TABLE `users_has_devices`
  ADD PRIMARY KEY (`id`,`fk_device`,`fk_user`),
  ADD UNIQUE KEY `uuid_UNIQUE` (`uuid`),
  ADD UNIQUE KEY `id_UNIQUE` (`id`),
  ADD KEY `fk_devices_has_users_users1_idx` (`fk_user`),
  ADD KEY `fk_devices_has_users_devices1_idx` (`fk_device`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `devices`
--
ALTER TABLE `devices`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `endpoints`
--
ALTER TABLE `endpoints`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `permissions`
--
ALTER TABLE `permissions`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT de la tabla `roles`
--
ALTER TABLE `roles`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `roles_has_permissions`
--
ALTER TABLE `roles_has_permissions`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39;

--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `users_has_devices`
--
ALTER TABLE `users_has_devices`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `permissions`
--
ALTER TABLE `permissions`
  ADD CONSTRAINT `fk_permissions_endpoints1` FOREIGN KEY (`fk_endpoint`) REFERENCES `endpoints` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Filtros para la tabla `roles_has_permissions`
--
ALTER TABLE `roles_has_permissions`
  ADD CONSTRAINT `fk_roles_has_permissions_permissions1` FOREIGN KEY (`fk_permission`) REFERENCES `permissions` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_roles_has_permissions_roles1` FOREIGN KEY (`fk_role`) REFERENCES `roles` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Filtros para la tabla `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `fk_user_roles1` FOREIGN KEY (`fk_role`) REFERENCES `roles` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Filtros para la tabla `users_has_devices`
--
ALTER TABLE `users_has_devices`
  ADD CONSTRAINT `fk_devices_has_users_devices1` FOREIGN KEY (`fk_device`) REFERENCES `devices` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_devices_has_users_users1` FOREIGN KEY (`fk_user`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
