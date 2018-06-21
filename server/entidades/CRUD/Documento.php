<?php
class Documento
{
   public $id;
   public $nombre;
   public $fecha;
   public $contenido;

   function __construct($id,$nombre,$fecha,$contenido){
      $this->id = $id;
      $this->nombre = $nombre;
      $this->fecha = $fecha;
      $this->contenido = $contenido;
   }
}
?>