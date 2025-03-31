-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 31-03-2025 a las 09:37:16
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

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `permissions`
--

CREATE TABLE `permissions` (
  `id` int(11) NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `action` enum('GET','POST','PUT','DELETE') NOT NULL,
  `resource_type` varchar(255) NOT NULL,
  `created` datetime NOT NULL DEFAULT current_timestamp(),
  `createdBy` varchar(255) DEFAULT NULL,
  `deleted` datetime DEFAULT NULL,
  `deletedBy` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `roles`
--

CREATE TABLE `roles` (
  `id` int(11) NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `created` datetime NOT NULL DEFAULT current_timestamp(),
  `createdBy` varchar(255) DEFAULT NULL,
  `deleted` datetime DEFAULT NULL,
  `deletedBy` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `roles_has_permissions`
--

CREATE TABLE `roles_has_permissions` (
  `id` bigint(20) NOT NULL,
  `fk_role` int(11) NOT NULL,
  `fk_permission` int(11) NOT NULL,
  `created` datetime NOT NULL DEFAULT current_timestamp(),
  `createdBy` varchar(255) DEFAULT NULL,
  `deleted` datetime DEFAULT NULL,
  `deletedBy` varchar(255) DEFAULT NULL,
  `uuid` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE `users` (
  `username` varchar(16) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(32) NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `id` bigint(20) NOT NULL,
  `fk_role` int(11) NOT NULL,
  `created` datetime NOT NULL DEFAULT current_timestamp(),
  `createdBy` varchar(255) DEFAULT NULL,
  `deleted` datetime DEFAULT NULL,
  `deletedBy` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

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
-- Indices de la tabla `permissions`
--
ALTER TABLE `permissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uuid_UNIQUE` (`uuid`);

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
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=58;

--
-- AUTO_INCREMENT de la tabla `permissions`
--
ALTER TABLE `permissions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `roles`
--
ALTER TABLE `roles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `roles_has_permissions`
--
ALTER TABLE `roles_has_permissions`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `users_has_devices`
--
ALTER TABLE `users_has_devices`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- Restricciones para tablas volcadas
--

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
