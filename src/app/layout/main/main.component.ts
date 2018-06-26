import { Usuario } from './../../entidades/CRUD/Usuario';
import { Documento } from './../../entidades/CRUD/Documento';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Http } from '@angular/http';
import { saveAs } from "file-saver/FileSaver";
import { UsuarioDocumento } from '../../entidades/CRUD/UsuarioDocumento';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  @ViewChild('fileInput') fileInput;
  @ViewChild('editor') editor;
  webServiceURL: string;
  pdfSrc: string;
  pdfBytes: string;
  pagina: number;
  documento: Documento;
  usuario: Usuario;
  proyectos: Documento[];
  autores: Usuario[];

  options: any = {printMargin: true, enableBasicAutocompletion: false, autoScrollEditorIntoView: true};

  constructor(public http: Http, private modalService: NgbModal) { }

  ngOnInit() {
    this.usuario = JSON.parse(sessionStorage.getItem('usuario')) as Usuario;
    this.documento = new Documento();
    this.documento.nombre = '';
    this.documento.fecha = new Date();
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
        this.documento.contenido = reader.result;
      };
      reader.readAsText(file);
    }
  }

  Compilar() {
    const data = {latex: this.documento.contenido};
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
    saveAs(blob, this.documento.nombre);
  }

  DescargarArchivoTEX() {
    const content = this.documento.contenido;
    const blob = new Blob([ content ], { type : 'text/plain' });
    saveAs(blob, this.documento.nombre + '.tex');
  }

  cambiarPagina(pagina: number) {
    if ( pagina < 1 ) {
        pagina = 1;
    }
    this.pagina = pagina;
  }

  guardarDocumentoBDD() {
    this.http.get(this.webServiceURL + 'documento/leer_filtrado?columna=nombre&tipo_filtro=coincide&filtro=' + this.documento.nombre + '&idUsuario=' + this.usuario.id)
    .subscribe(r => {
      if ( r.json()[0] === 0 ) {
        this.http.post(this.webServiceURL + 'documento/crear', JSON.stringify(this.documento))
        .subscribe(r1 => {
          this.http.get(this.webServiceURL + 'documento/leer_filtrado?columna=nombre&tipo_filtro=coincide&filtro=' + this.documento.nombre + '&idUsuario=' + this.usuario.id)
          .subscribe(r2 => {
            const documentoCreado = r2.json()[0] as Documento;
            const documentoUsuario: UsuarioDocumento = new UsuarioDocumento();
            documentoUsuario.idDocumento = documentoCreado.id;
            documentoUsuario.idUsuario = this.usuario.id;
            this.http.post(this.webServiceURL + 'usuariodocumento/crear', JSON.stringify(documentoUsuario))
            .subscribe(r3 => {

            }, error => {
            });
          }, error => {
          });
        }, error => {
        });
      } else {
        const documentoPrevio = r.json()[0] as Documento;
        this.documento.id = documentoPrevio.id;
        this.http.post(this.webServiceURL + 'documento/actualizar', JSON.stringify(this.documento))
        .subscribe(r1 => {
        }, error => {
        });
      }
    }, error => {
    });
  }

  sincronizarDocumentoBDD() {
    this.http.get(this.webServiceURL + 'documento/leer_filtrado?columna=nombre&tipo_filtro=coincide&filtro=' + this.documento.nombre + '&idUsuario=' + this.usuario.id)
    .subscribe(r => {
      if ( r.json()[0] === 0 ) {
        return;
      }
      this.documento = r.json()[0] as Documento;
    }, error => {
    });
  }

  compartirDocumento(content) {
    this.http.get(this.webServiceURL + 'usuario/leer')
    .subscribe(r => {
      if ( r.json()[0] === 0 ) {
        return;
      }
      this.autores = r.json() as Usuario[];
    }, error => {
    });
    this.mostrarInfo(content);
  }

  abrirDocumento(content) {
    this.http.get(this.webServiceURL + 'documento/leer_filtrado?columna=1&tipo_filtro=coincide&filtro=1&idUsuario=' + this.usuario.id)
    .subscribe(r => {
      if ( r.json()[0] === 0 ) {
        return;
      }
      this.proyectos = r.json() as Documento[];
    }, error => {
    });
    this.mostrarInfo(content);
  }

  mostrarInfo(content) {
    const options: NgbModalOptions = {
      size: 'lg'
    };
    this.modalService.open(content, options)
    .result
    .then((result => {

    }), (result => {
asdasdsa
    }));
  }

  alertarPosicion() {
    console.log({fila: this.editor.getEditor().getSelection().lead.row, columna: this.editor.getEditor().getSelection().lead.column});
  }
}
