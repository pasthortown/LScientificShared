<?php
class FotoPerfil
{
   public $id;
   public $idUsuario;
   public $tipoArchivo;
   public $nombreArchivo;
   public $adjunto;

   function __construct($id,$idUsuario,$tipoArchivo,$nombreArchivo,$adjunto){
      $this->id = $id;
      $this->idUsuario = $idUsuario;
      $this->tipoArchivo = $tipoArchivo;
      $this->nombreArchivo = $nombreArchivo;
      $this->adjunto = $adjunto;
   }
}
?>