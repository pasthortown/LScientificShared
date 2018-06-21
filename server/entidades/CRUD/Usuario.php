<?php
class Usuario
{
   public $id;
   public $identificacion;
   public $nombres;
   public $apellidos;
   public $telefono1;
   public $titulo;
   public $email;
   public $institucion;
   public $departamento;

   function __construct($id,$identificacion,$nombres,$apellidos,$telefono1,$titulo,$email,$institucion,$departamento){
      $this->id = $id;
      $this->identificacion = $identificacion;
      $this->nombres = $nombres;
      $this->apellidos = $apellidos;
      $this->telefono1 = $telefono1;
      $this->titulo = $titulo;
      $this->email = $email;
      $this->institucion = $institucion;
      $this->departamento = $departamento;
   }
}
?>