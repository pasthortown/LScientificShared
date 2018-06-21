<?php
class UsuarioDocumento
{
   public $id;
   public $idUsuario;
   public $idDocumento;

   function __construct($id,$idUsuario,$idDocumento){
      $this->id = $id;
      $this->idUsuario = $idUsuario;
      $this->idDocumento = $idDocumento;
   }
}
?>