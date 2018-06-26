CREATE DATABASE LScientificShared DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci;
USE LScientificShared;

CREATE TABLE Cuenta (
    id INT NOT NULL AUTO_INCREMENT,
    idUsuario INT NOT NULL UNIQUE,
    clave BLOB NULL,
    PRIMARY KEY (id)
);

CREATE TABLE Usuario (
    id INT NOT NULL AUTO_INCREMENT,
    identificacion VARCHAR(20) NOT NULL UNIQUE,
    nombres VARCHAR(100) NULL,
    apellidos VARCHAR(100) NULL,
    telefono1 VARCHAR(20) NULL,
    titulo VARCHAR(20) NULL,
    email VARCHAR(255) NULL,
    institucion VARCHAR(100) NULL,
    departamento VARCHAR(100) NULL,
    PRIMARY KEY (id)
);

CREATE TABLE UsuarioDocumento (
    id INT NOT NULL AUTO_INCREMENT,
    idUsuario INT NOT NULL,
    idDocumento INT NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE Documento (
    id INT NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(500) NULL,
  	fecha DATETIME NULL,
    contenido LONGTEXT NULL,
	  PRIMARY KEY (id)
) ENGINE myISAM;

CREATE TABLE FotoPerfil (
    id INT NOT NULL AUTO_INCREMENT,
    idUsuario INT NOT NULL,
    tipoArchivo VARCHAR(255) NULL,
    nombreArchivo VARCHAR(255) NULL,
    adjunto LONGBLOB NULL,
    PRIMARY KEY (id)
) ENGINE myISAM;
