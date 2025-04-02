-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 02-04-2025 a las 18:01:54
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
  `stock` int(11) NOT NULL DEFAULT 0,
  `description` varchar(255) DEFAULT NULL,
  `createdBy` varchar(255) DEFAULT NULL,
  `deleted` datetime DEFAULT NULL,
  `deletedBy` varchar(255) DEFAULT NULL,
  `created` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Volcado de datos para la tabla `devices`
--

INSERT INTO `devices` (`id`, `uuid`, `serial_number`, `model`, `brand`, `stock`, `description`, `createdBy`, `deleted`, `deletedBy`, `created`) VALUES
(1, '927a5436-0ed5-11f0-8154-bce92f8462b5', 'SN001', 'Laptop X1', 'TechBrand', 0, 'High performance laptop', 'system', '2025-04-02 15:34:45', '00f6f64a-0ee1-11f0-8154-bce92f8462b5', '2025-04-01 10:44:49'),
(2, '927a6280-0ed5-11f0-8154-bce92f8462b5', 'SN00HOLI', 'Smartphone Shey', 'MobileTechno', 10, 'Latest smartphone model', 'system', NULL, NULL, '2025-04-01 10:44:49'),
(3, '927a6306-0ed5-11f0-8154-bce92f8462b5', 'SN003', 'Tablet Pro', 'TabletCo', 0, 'Professional tablet for designers', 'system', NULL, NULL, '2025-04-01 10:44:49'),
(4, 'ced10df0-551a-49e6-b13f-50a3fbddb898', 'SN00HOLI2', 'Smartphone Shey2', 'MobileTechno2', 100, NULL, '00f6f64a-0ee1-11f0-8154-bce92f8462b5', NULL, NULL, '2025-04-02 15:50:58'),
(5, '886cfb45-1d16-41c0-8fbd-ce401b7c1f37', 'SN00HOLI3', 'Smartphone Shey3', 'MobileTechno3', 100, NULL, '00f6f64a-0ee1-11f0-8154-bce92f8462b5', NULL, NULL, '2025-04-02 15:52:23'),
(6, '093e9638-f6ff-41bc-859f-a3ab45658745', 'SN00HOLI4', 'Smartphone Shey4', 'MobileTechno4', 100, NULL, '00f6f64a-0ee1-11f0-8154-bce92f8462b5', NULL, NULL, '2025-04-02 15:53:39'),
(7, 'b3095727-3009-459f-83fe-735c7c55c3e2', 'SN00HOLI5', 'Smartphone Shey5', 'MobileTechno5', 100, NULL, '00f6f64a-0ee1-11f0-8154-bce92f8462b5', NULL, NULL, '2025-04-02 15:54:34'),
(8, 'f39c28c6-1f6f-4947-b784-15622f4e90d3', 'SN00HOLI5', 'Smartphone Shey5', 'MobileTechno5', 100, 'Latest smartphone model :D', '00f6f64a-0ee1-11f0-8154-bce92f8462b5', NULL, NULL, '2025-04-02 15:55:41');

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

--
-- Volcado de datos para la tabla `endpoints`
--

INSERT INTO `endpoints` (`id`, `uuid`, `route`, `created`, `createdBy`, `deleted`, `deletedBy`) VALUES
(1, 'c751f8fc-0f95-11f0-8cdf-bce92f8462b5', '/', '2025-04-02 09:40:41', NULL, NULL, NULL),
(2, 'c7906461-0f95-11f0-8cdf-bce92f8462b5', '/devices', '2025-04-02 09:40:42', NULL, NULL, NULL),
(3, 'c79246bc-0f95-11f0-8cdf-bce92f8462b5', '/devices/inStock', '2025-04-02 09:40:42', NULL, NULL, NULL),
(4, 'c7941aa4-0f95-11f0-8cdf-bce92f8462b5', '/devices/minStock/:stock', '2025-04-02 09:40:42', NULL, NULL, NULL),
(5, 'c795ef5a-0f95-11f0-8cdf-bce92f8462b5', '/devices/:uuid', '2025-04-02 09:40:42', NULL, NULL, NULL),
(6, 'c797bce4-0f95-11f0-8cdf-bce92f8462b5', '/devices/serial_number/:serial_number', '2025-04-02 09:40:42', NULL, NULL, NULL),
(7, 'c7998153-0f95-11f0-8cdf-bce92f8462b5', '/devices/model/:model', '2025-04-02 09:40:42', NULL, NULL, NULL),
(8, 'c79b52a8-0f95-11f0-8cdf-bce92f8462b5', '/devices/brand/:brand', '2025-04-02 09:40:42', NULL, NULL, NULL),
(9, 'c79d1c65-0f95-11f0-8cdf-bce92f8462b5', '/users', '2025-04-02 09:40:42', NULL, NULL, NULL),
(10, 'c79ee77f-0f95-11f0-8cdf-bce92f8462b5', '/users/:uuid', '2025-04-02 09:40:42', NULL, NULL, NULL),
(11, 'c7a0c191-0f95-11f0-8cdf-bce92f8462b5', '/roles', '2025-04-02 09:40:42', NULL, NULL, NULL),
(12, 'c7a2994a-0f95-11f0-8cdf-bce92f8462b5', '/roles/:uuid', '2025-04-02 09:40:42', NULL, NULL, NULL),
(13, 'c7a4822c-0f95-11f0-8cdf-bce92f8462b5', '/permissions', '2025-04-02 09:40:42', NULL, NULL, NULL),
(14, 'c7a6561f-0f95-11f0-8cdf-bce92f8462b5', '/permissions/:uuid', '2025-04-02 09:40:42', NULL, NULL, NULL),
(15, 'c7a85af5-0f95-11f0-8cdf-bce92f8462b5', '/login', '2025-04-02 09:40:42', NULL, NULL, NULL);

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
(44, '3b8ef98c-0f97-11f0-8cdf-bce92f8462b5', 'GET', '2025-04-02 09:51:06', NULL, NULL, NULL, 1),
(45, '3b8f062f-0f97-11f0-8cdf-bce92f8462b5', 'GET', '2025-04-02 09:51:06', NULL, NULL, NULL, 2),
(46, '3b8f0782-0f97-11f0-8cdf-bce92f8462b5', 'POST', '2025-04-02 09:51:06', NULL, NULL, NULL, 2),
(47, '3b8f07d0-0f97-11f0-8cdf-bce92f8462b5', 'PUT', '2025-04-02 09:51:06', NULL, NULL, NULL, 5),
(48, '3b8f089e-0f97-11f0-8cdf-bce92f8462b5', 'DELETE', '2025-04-02 09:51:06', NULL, NULL, NULL, 5),
(49, '3b8f97a2-0f97-11f0-8cdf-bce92f8462b5', 'GET', '2025-04-02 09:51:06', NULL, NULL, NULL, 3),
(50, '3b8f9950-0f97-11f0-8cdf-bce92f8462b5', 'GET', '2025-04-02 09:51:06', NULL, NULL, NULL, 4),
(51, '3b8f9a97-0f97-11f0-8cdf-bce92f8462b5', 'GET', '2025-04-02 09:51:06', NULL, NULL, NULL, 5),
(52, '3b8f9b2e-0f97-11f0-8cdf-bce92f8462b5', 'GET', '2025-04-02 09:51:06', NULL, NULL, NULL, 6),
(53, '3b8f9b8e-0f97-11f0-8cdf-bce92f8462b5', 'GET', '2025-04-02 09:51:06', NULL, NULL, NULL, 7),
(54, '3b8f9bf5-0f97-11f0-8cdf-bce92f8462b5', 'GET', '2025-04-02 09:51:06', NULL, NULL, NULL, 8),
(55, '3b8f9c5a-0f97-11f0-8cdf-bce92f8462b5', 'GET', '2025-04-02 09:51:06', NULL, NULL, NULL, 9),
(56, '3b8f9cba-0f97-11f0-8cdf-bce92f8462b5', 'POST', '2025-04-02 09:51:06', NULL, NULL, NULL, 9),
(57, '3b8f9d1a-0f97-11f0-8cdf-bce92f8462b5', 'GET', '2025-04-02 09:51:06', NULL, NULL, NULL, 10),
(58, '3b8f9d7a-0f97-11f0-8cdf-bce92f8462b5', 'PUT', '2025-04-02 09:51:06', NULL, NULL, NULL, 10),
(59, '3b8f9e58-0f97-11f0-8cdf-bce92f8462b5', 'DELETE', '2025-04-02 09:51:06', NULL, NULL, NULL, 10),
(60, '3b8f9f87-0f97-11f0-8cdf-bce92f8462b5', 'GET', '2025-04-02 09:51:06', NULL, NULL, NULL, 11),
(61, '3b8f9ff7-0f97-11f0-8cdf-bce92f8462b5', 'POST', '2025-04-02 09:51:06', NULL, NULL, NULL, 11),
(62, '3b8fa067-0f97-11f0-8cdf-bce92f8462b5', 'GET', '2025-04-02 09:51:06', NULL, NULL, NULL, 12),
(63, '3b8fa0d2-0f97-11f0-8cdf-bce92f8462b5', 'PUT', '2025-04-02 09:51:06', NULL, NULL, NULL, 12),
(64, '3b8fa1c4-0f97-11f0-8cdf-bce92f8462b5', 'DELETE', '2025-04-02 09:51:06', NULL, NULL, NULL, 12),
(65, '3b8fa231-0f97-11f0-8cdf-bce92f8462b5', 'GET', '2025-04-02 09:51:06', NULL, NULL, NULL, 13),
(66, '3b8fa29a-0f97-11f0-8cdf-bce92f8462b5', 'POST', '2025-04-02 09:51:06', NULL, NULL, NULL, 13),
(67, '3b8fa2fd-0f97-11f0-8cdf-bce92f8462b5', 'GET', '2025-04-02 09:51:06', NULL, NULL, NULL, 14),
(68, '3b8fa368-0f97-11f0-8cdf-bce92f8462b5', 'PUT', '2025-04-02 09:51:06', NULL, NULL, NULL, 14),
(69, '3b8fa3d3-0f97-11f0-8cdf-bce92f8462b5', 'DELETE', '2025-04-02 09:51:06', NULL, NULL, NULL, 14),
(70, '3b8fa43a-0f97-11f0-8cdf-bce92f8462b5', 'POST', '2025-04-02 09:51:06', NULL, NULL, NULL, 15);

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
(49, 1, 44, '2025-04-02 09:57:21', NULL, NULL, NULL, '1b21126b-0f98-11f0-8cdf-bce92f8462b5'),
(50, 1, 45, '2025-04-02 09:57:21', NULL, NULL, NULL, '1b211ce9-0f98-11f0-8cdf-bce92f8462b5'),
(51, 1, 46, '2025-04-02 09:57:21', NULL, NULL, NULL, '1b211d8b-0f98-11f0-8cdf-bce92f8462b5'),
(52, 1, 47, '2025-04-02 09:57:21', NULL, NULL, NULL, '1b211de6-0f98-11f0-8cdf-bce92f8462b5'),
(53, 1, 48, '2025-04-02 09:57:21', NULL, NULL, NULL, '1b211e39-0f98-11f0-8cdf-bce92f8462b5'),
(73, 1, 49, '2025-04-02 10:01:30', NULL, NULL, NULL, 'afb81f31-0f98-11f0-8cdf-bce92f8462b5'),
(74, 1, 50, '2025-04-02 10:01:30', NULL, NULL, NULL, 'afb82bab-0f98-11f0-8cdf-bce92f8462b5'),
(75, 1, 51, '2025-04-02 10:01:30', NULL, NULL, NULL, 'afb82c3d-0f98-11f0-8cdf-bce92f8462b5'),
(76, 1, 52, '2025-04-02 10:01:30', NULL, NULL, NULL, 'afb82d55-0f98-11f0-8cdf-bce92f8462b5'),
(77, 1, 53, '2025-04-02 10:01:30', NULL, NULL, NULL, 'afb82db1-0f98-11f0-8cdf-bce92f8462b5'),
(78, 1, 54, '2025-04-02 10:01:30', NULL, NULL, NULL, 'afb82ebc-0f98-11f0-8cdf-bce92f8462b5'),
(79, 1, 55, '2025-04-02 10:01:30', NULL, NULL, NULL, 'afb8c3c1-0f98-11f0-8cdf-bce92f8462b5'),
(80, 1, 56, '2025-04-02 10:01:30', NULL, NULL, NULL, 'afb8c609-0f98-11f0-8cdf-bce92f8462b5'),
(81, 1, 57, '2025-04-02 10:01:30', NULL, NULL, NULL, 'afb8c696-0f98-11f0-8cdf-bce92f8462b5'),
(82, 1, 58, '2025-04-02 10:01:30', NULL, NULL, NULL, 'afb8c70a-0f98-11f0-8cdf-bce92f8462b5');

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
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `endpoints`
--
ALTER TABLE `endpoints`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT de la tabla `permissions`
--
ALTER TABLE `permissions`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=71;

--
-- AUTO_INCREMENT de la tabla `roles`
--
ALTER TABLE `roles`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `roles_has_permissions`
--
ALTER TABLE `roles_has_permissions`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=83;

--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `users_has_devices`
--
ALTER TABLE `users_has_devices`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

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
