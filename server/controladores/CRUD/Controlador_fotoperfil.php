<?php
include_once('../controladores/Controlador_Base.php');
include_once('../entidades/CRUD/FotoPerfil.php');
class Controlador_fotoperfil extends Controlador_Base
{
   function crear($args)
   {
      $fotoperfil = new FotoPerfil($args["id"],$args["idUsuario"],$args["tipoArchivo"],$args["nombreArchivo"],$args["adjunto"]);
      $sql = "INSERT INTO FotoPerfil (idUsuario,tipoArchivo,nombreArchivo,adjunto) VALUES (?,?,?,?);";
      $parametros = array($fotoperfil->idUsuario,$fotoperfil->tipoArchivo,$fotoperfil->nombreArchivo,$fotoperfil->adjunto);
      $respuesta = $this->conexion->ejecutarConsulta($sql,$parametros);
      if(is_null($respuesta[0])){
         return true;
      }else{
         return false;
      }
   }

   function actualizar($args)
   {
      $fotoperfil = new FotoPerfil($args["id"],$args["idUsuario"],$args["tipoArchivo"],$args["nombreArchivo"],$args["adjunto"]);
      $parametros = array($fotoperfil->idUsuario,$fotoperfil->tipoArchivo,$fotoperfil->nombreArchivo,$fotoperfil->adjunto,$fotoperfil->id);
      $sql = "UPDATE FotoPerfil SET idUsuario = ?,tipoArchivo = ?,nombreArchivo = ?,adjunto = ? WHERE id = ?;";
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
      $sql = "DELETE FROM FotoPerfil WHERE id = ?;";
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
         $sql = "SELECT * FROM FotoPerfil;";
      }else{
      $parametros = array($id);
         $sql = "SELECT * FROM FotoPerfil WHERE id = ?;";
      }
      $respuesta = $this->conexion->ejecutarConsulta($sql,$parametros);
      return $respuesta;
   }

   function leer_paginado($args)
   {
      $pagina = $args["pagina"];
      $registrosPorPagina = $args["registros_por_pagina"];
      $desde = (($pagina-1)*$registrosPorPagina);
      $sql ="SELECT * FROM FotoPerfil LIMIT $desde,$registrosPorPagina;";
      $respuesta = $this->conexion->ejecutarConsulta($sql,$parametros);
      return $respuesta;
   }

   function numero_paginas($args)
   {
      $registrosPorPagina = $args["registros_por_pagina"];
      $sql ="SELECT IF(ceil(count(*)/$registrosPorPagina)>0,ceil(count(*)/$registrosPorPagina),1) as 'paginas' FROM FotoPerfil;";
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
            $sql = "SELECT * FROM FotoPerfil WHERE $nombreColumna = ?;";
            break;
         case "inicia":
            $sql = "SELECT * FROM FotoPerfil WHERE $nombreColumna LIKE '$filtro%';";
            break;
         case "termina":
            $sql = "SELECT * FROM FotoPerfil WHERE $nombreColumna LIKE '%$filtro';";
            break;
         default:
            $sql = "SELECT * FROM FotoPerfil WHERE $nombreColumna LIKE '%$filtro%';";
            break;
      }
      $respuesta = $this->conexion->ejecutarConsulta($sql,$parametros);
      return $respuesta;
   }
}