<?php
include_once('../controladores/ControladorBase.php');
class Controlador_pdfbuilder
{
    function compilar($args){
        $latex = $args["latex"];
        $latexTempName = uniqid();
        $latexTempFile = fopen($latexTempName.".tex","w");
        fwrite($latexTempFile,$latex);
        fclose($latexTempFile);
        $str = shell_exec("latexmk -pdf -silent -shell-escape -interaction=nonstopmode ".$latexTempName.".tex");
        $pdfData = file_get_contents($latexTempName.".pdf");
        $base64 = base64_encode($pdfData);
        $str = shell_exec("rm -rf ".$latexTempName."*.*");
        return ["pdf"=>$base64];
    }
}