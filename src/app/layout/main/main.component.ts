import { Component, OnInit, ViewChild } from '@angular/core';
import { Http } from '@angular/http';
import { saveAs } from "file-saver/FileSaver";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  @ViewChild('fileInput') fileInput;
  pdfSrc: string;
  latexcode: string;
  webServiceURL: string;
  pdfBytes: string;
  pagina: number;
  tituloDocumento: string;
  username: string;
  options: any = {printMargin: true, enableBasicAutocompletion: false, autoScrollEditorIntoView: true};

  constructor(public http: Http) { }

  ngOnInit() {
    this.username = 'Luis Alfonso Salazar Vaca';
    this.pagina = 1;
    this.pdfSrc = './../../../assets/pdfs/prueba.pdf';
    this.webServiceURL = 'http://192.168.20.10/LScientificShared/server/pdfbuilder/';
  }

  subirArchivo() {
    this.fileInput.nativeElement.click();
  }

  LeerArchivo(event) {
    const reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      reader.onload = (e) => {
        this.latexcode = reader.result;
      };
      reader.readAsText(file);
    }
  }

  Compilar() {
    const data = {latex: this.latexcode};
    this.http.post(this.webServiceURL + 'compilar', JSON.stringify(data))
    .subscribe(r1 => {
        const respuesta = r1.json();
        this.pdfBytes = respuesta.pdf;
        this.pdfSrc = 'data:application/pdf;base64,' + this.pdfBytes;
    }, error => {

    });
  }

  DescargarArchivo() {
    const byteCharacters = atob(this.pdfBytes);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'application/pdf' });
    saveAs(blob, this.tituloDocumento);
  }

  DescargarArchivoTEX() {
    const content = this.latexcode;
    const blob = new Blob([ content ], { type : 'text/plain' });
    saveAs(blob, this.tituloDocumento + '.tex');
  }

  cambiarPagina(pagina: number) {
    if ( pagina < 1 ) {
        pagina = 1;
    }
    this.pagina = pagina;
  }
}
