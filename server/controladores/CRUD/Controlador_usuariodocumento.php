<?php
include_once('../controladores/Controlador_Base.php');
include_once('../entidades/CRUD/UsuarioDocumento.php');
class Controlador_usuariodocumento extends Controlador_Base
{
   function crear($args)
   {
      $usuariodocumento = new UsuarioDocumento($args["id"],$args["idUsuario"],$args["idDocumento"]);
      $sql = "INSERT INTO UsuarioDocumento (idUsuario,idDocumento) VALUES (?,?);";
      $parametros = array($usuariodocumento->idUsuario,$usuariodocumento->idDocumento);
      $respuesta = $this->conexion->ejecutarConsulta($sql,$parametros);
      if(is_null($respuesta[0])){
         return true;
      }else{
         return false;
      }
   }

   function actualizar($args)
   {
      $usuariodocumento = new UsuarioDocumento($args["id"],$args["idUsuario"],$args["idDocumento"]);
      $parametros = array($usuariodocumento->idUsuario,$usuariodocumento->idDocumento,$usuariodocumento->id);
      $sql = "UPDATE UsuarioDocumento SET idUsuario = ?,idDocumento = ? WHERE id = ?;";
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
      $sql = "DELETE FROM UsuarioDocumento WHERE id = ?;";
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
         $sql = "SELECT * FROM UsuarioDocumento;";
      }else{
      $parametros = array($id);
         $sql = "SELECT * FROM UsuarioDocumento WHERE id = ?;";
      }
      $respuesta = $this->conexion->ejecutarConsulta($sql,$parametros);
      return $respuesta;
   }

   function leer_paginado($args)
   {
      $pagina = $args["pagina"];
      $registrosPorPagina = $args["registros_por_pagina"];
      $desde = (($pagina-1)*$registrosPorPagina);
      $sql ="SELECT * FROM UsuarioDocumento LIMIT $desde,$registrosPorPagina;";
      $respuesta = $this->conexion->ejecutarConsulta($sql,$parametros);
      return $respuesta;
   }

   function numero_paginas($args)
   {
      $registrosPorPagina = $args["registros_por_pagina"];
      $sql ="SELECT IF(ceil(count(*)/$registrosPorPagina)>0,ceil(count(*)/$registrosPorPagina),1) as 'paginas' FROM UsuarioDocumento;";
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
            $sql = "SELECT * FROM UsuarioDocumento WHERE $nombreColumna = ?;";
            break;
         case "inicia":
            $sql = "SELECT * FROM UsuarioDocumento WHERE $nombreColumna LIKE '$filtro%';";
            break;
         case "termina":
            $sql = "SELECT * FROM UsuarioDocumento WHERE $nombreColumna LIKE '%$filtro';";
            break;
         default:
            $sql = "SELECT * FROM UsuarioDocumento WHERE $nombreColumna LIKE '%$filtro%';";
            break;
      }
      $respuesta = $this->conexion->ejecutarConsulta($sql,$parametros);
      return $respuesta;
   }
}