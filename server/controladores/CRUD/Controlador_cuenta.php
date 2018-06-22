<?php
include_once('../controladores/Controlador_Base.php');
include_once('../entidades/CRUD/Cuenta.php');
class Controlador_cuenta extends Controlador_Base
{
   function crear($args)
   {
      $cuenta = new Cuenta($args["id"],$args["idUsuario"],$args["clave"]);
      $sql = "INSERT INTO Cuenta (idUsuario,clave) VALUES (?,aes_encrypt(?,'".CIFRADO."'));";
      $parametros = array($cuenta->idUsuario,$cuenta->clave);
      $respuesta = $this->conexion->ejecutarConsulta($sql,$parametros);
      if(is_null($respuesta[0])){
         return true;
      }else{
         return false;
      }
   }

   function actualizar($args)
   {
      $cuenta = new Cuenta($args["id"],$args["idUsuario"],$args["clave"]);
      $parametros = array($cuenta->idUsuario,$cuenta->clave,$cuenta->id);
      $sql = "UPDATE Cuenta SET idUsuario = ?,clave = aes_encrypt(?,'".CIFRADO."') WHERE id = ?;";
      $respuesta = $this->conexion->ejecutarConsulta($sql,$parametros);
      if(is_null($respuesta[0])){
         return true;
      }else{
         return false;
      }
   }

   function borrar($args)
   {
      $id = $args["id"];
      $parametros = array($id);
      $sql = "DELETE FROM Cuenta WHERE id = ?;";
      $respuesta = $this->conexion->ejecutarConsulta($sql,$parametros);
      if(is_null($respuesta[0])){
         return true;
      }else{
         return false;
      }
   }

   function leer($args)
   {
      $id = $args["id"];
      if ($id==""){
         $sql = "SELECT idUsuario FROM Cuenta;";
      }else{
      $parametros = array($id);
         $sql = "SELECT idUsuario FROM Cuenta WHERE id = ?;";
      }
      $respuesta = $this->conexion->ejecutarConsulta($sql,$parametros);
      return $respuesta;
   }

   function leer_paginado($args)
   {
      $pagina = $args["pagina"];
      $registrosPorPagina = $args["registros_por_pagina"];
      $desde = (($pagina-1)*$registrosPorPagina);
      $sql ="SELECT idUsuario FROM Cuenta LIMIT $desde,$registrosPorPagina;";
      $respuesta = $this->conexion->ejecutarConsulta($sql,$parametros);
      return $respuesta;
   }

   function numero_paginas($args)
   {
      $registrosPorPagina = $args["registros_por_pagina"];
      $sql ="SELECT IF(ceil(count(idUsuario)/$registrosPorPagina)>0,ceil(count(idUsuario)/$registrosPorPagina),1) as 'paginas' FROM Cuenta;";
      $respuesta = $this->conexion->ejecutarConsulta($sql,$parametros);
      return $respuesta[0];
   }

   function leer_filtrado($args)
   {
      $nombreColumna = $args["columna"];
      $tipoFiltro = $args["tipo_filtro"];
      $filtro = $args["filtro"];
      switch ($tipoFiltro){
         case "coincide":
            $parametros = array($filtro);
            $sql = "SELECT idUsuario FROM Cuenta WHERE $nombreColumna = ?;";
            break;
         case "inicia":
            $sql = "SELECT idUsuario FROM Cuenta WHERE $nombreColumna LIKE '$filtro%';";
            break;
         case "termina":
            $sql = "SELECT idUsuario FROM Cuenta WHERE $nombreColumna LIKE '%$filtro';";
            break;
         default:
            $sql = "SELECT idUsuario FROM Cuenta WHERE $nombreColumna LIKE '%$filtro%';";
            break;
      }
      $respuesta = $this->conexion->ejecutarConsulta($sql,$parametros);
      return $respuesta;
   }
}