<?php
include_once('../controladores/Controlador_Base.php');
include_once('../controladores/especificos/Controlador_login.php');

class Controlador_cuentas extends Controlador_Base
{

   function crear_cuenta($args)
   {
      $identificacion = $args["identificacion"];
      $nombres = $args["nombres"];
      $apellidos = $args["apellidos"];
      $telefono1 = $args["telefono1"];
      $titulo = $args["titulo"];
      $email = $args["email"];
      $institucion = $args["institucion"];
      $departamento = $args["departamento"];
      $parametros = array($identificacion,$nombres,$apellidos,$telefono1,$titulo,$email,$institucion,$departamento);
      $sql = "INSERT INTO Usuario (identificacion, nombres, apellidos, telefono1, titulo, email, institucion, departamento) VALUES (?,?,?,?,?,?,?,?);";
      $insert = $this->conexion->ejecutarConsulta($sql,$parametros);
      $sql = "SELECT * FROM Usuario WHERE identificacion = ?;";
      $parametros = array($identificacion);
      $respuesta = $this->conexion->ejecutarConsulta($sql,$parametros);
      $idUsuario = $respuesta[0]["id"];
      $parametros = array($idUsuario);
      $sql = "INSERT INTO Cuenta (idUsuario) VALUES (?);";
      $cuenta = $this->conexion->ejecutarConsulta($sql,$parametros);
      $controladorLogin = new Controlador_login();
      $args = array("email"=>$email, "accion"=>"Tu cuenta en LSystems-Scientific-Shared");
      return $controladorLogin->passwordChange($args);
   }
}