<?php
class Cuenta
{
   public $id;
   public $idUsuario;
   public $clave;

   function __construct($id,$idUsuario,$clave){
      $this->id = $id;
      $this->idUsuario = $idUsuario;
      $this->clave = $clave;
   }
}
?>