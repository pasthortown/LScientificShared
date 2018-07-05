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
  abstract: string;
  cursorPositionDesde = {fila: 0, columna: 0};
  cursorPositionHasta = {fila: 0, columna: 0};
  options: any = {printMargin: true, enableBasicAutocompletion: false, autoScrollEditorIntoView: true};

  constructor(public http: Http, private modalService: NgbModal) { }

  ngOnInit() {
    this.usuario = JSON.parse(sessionStorage.getItem('usuario')) as Usuario;
    this.documento = new Documento();
    this.documento.nombre = '';
    this.documento.contenido = '';
    this.documento.fecha = new Date();
    this.pagina = 1;
    this.plantilla('article');
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

    }));
  }

  getCursorPosition() {
    if ( this.editor.getEditor().getSelection().anchor.row < this.editor.getEditor().getSelection().lead.row ) {
      this.cursorPositionDesde.fila = this.editor.getEditor().getSelection().anchor.row;
      this.cursorPositionDesde.columna = this.editor.getEditor().getSelection().anchor.column;
      this.cursorPositionHasta.fila = this.editor.getEditor().getSelection().lead.row;
      this.cursorPositionHasta.columna = this.editor.getEditor().getSelection().lead.column;
    }
    if ( this.editor.getEditor().getSelection().anchor.row === this.editor.getEditor().getSelection().lead.row ) {
      if ( this.editor.getEditor().getSelection().anchor.column < this.editor.getEditor().getSelection().lead.column ) {
        this.cursorPositionDesde.fila = this.editor.getEditor().getSelection().anchor.row;
        this.cursorPositionDesde.columna = this.editor.getEditor().getSelection().anchor.column;
        this.cursorPositionHasta.fila = this.editor.getEditor().getSelection().lead.row;
        this.cursorPositionHasta.columna = this.editor.getEditor().getSelection().lead.column;
      } else {
        this.cursorPositionDesde.fila = this.editor.getEditor().getSelection().lead.row;
        this.cursorPositionDesde.columna = this.editor.getEditor().getSelection().lead.column;
        this.cursorPositionHasta.fila = this.editor.getEditor().getSelection().anchor.row;
        this.cursorPositionHasta.columna = this.editor.getEditor().getSelection().anchor.column;
      }
    }
    if ( this.editor.getEditor().getSelection().anchor.row > this.editor.getEditor().getSelection().lead.row ) {
      this.cursorPositionDesde.fila = this.editor.getEditor().getSelection().lead.row;
      this.cursorPositionDesde.columna = this.editor.getEditor().getSelection().lead.column;
      this.cursorPositionHasta.fila = this.editor.getEditor().getSelection().anchor.row;
      this.cursorPositionHasta.columna = this.editor.getEditor().getSelection().anchor.column;
    }
  }

  insertInLatex(toInsertBefore: string, toInsertAfter: string) {
    if ( this.documento.contenido === '') {
      return toInsertBefore + toInsertAfter;
    }
    this.getCursorPosition();
    const latex = this.documento.contenido.split('\n');
    let parteInicial = '';
    for ( let i = 0; i < this.cursorPositionDesde.fila; i++ ) {
      parteInicial += latex[i] + '\n';
    }
    parteInicial += latex[this.cursorPositionDesde.fila].substring(0, this.cursorPositionDesde.columna);
    let parteSeleccionada = '';
    if ( this.cursorPositionHasta.fila === this.cursorPositionDesde.fila ) {
      parteSeleccionada += latex[this.cursorPositionDesde.fila].substring(this.cursorPositionDesde.columna, this.cursorPositionHasta.columna);
    } else {
      parteSeleccionada += latex[this.cursorPositionDesde.fila].substring(this.cursorPositionDesde.columna) + '\n';
      for ( let i = this.cursorPositionDesde.fila + 1; i < this.cursorPositionHasta.fila; i++ ) {
        parteSeleccionada += latex[i] + '\n';
      }
      parteSeleccionada += latex[this.cursorPositionHasta.fila].substring(0, this.cursorPositionHasta.columna);
    }
    let parteFinal = '';
    parteFinal += latex[this.cursorPositionHasta.fila].substring(this.cursorPositionHasta.columna);
    if ( this.cursorPositionHasta.fila !== latex.length - 1) {
      parteFinal += '\n';
      for ( let i = this.cursorPositionHasta.fila + 1; i < latex.length - 1; i++ ) {
        parteFinal += latex[i] + '\n';
      }
      parteFinal += latex[latex.length - 1];
    }
    return parteInicial + toInsertBefore + parteSeleccionada + toInsertAfter + parteFinal;
  }

  insert(toInsertBefore: string, toInsertAfter: string) {
    this.documento.contenido = this.insertInLatex(toInsertBefore, toInsertAfter);
  }

  plantilla(tipo: string) {
    switch ( tipo ) {
      case 'apa':
        this.documento.contenido = '\\documentclass[12pts]{apa6}\n';
        this.documento.contenido += '\\usepackage[utf8]{inputenc}\n';
        this.documento.contenido += '\\title{' + this.documento.nombre + '}\n';
        this.documento.contenido += '\\shorttitle{}\n';
        this.documento.contenido += '\\threeauthors{}{}{}\n';
        this.documento.contenido += '\\threeaffiliations{}{}{}\n';
        this.documento.contenido += '\\abstract{}\n';
        this.documento.contenido += '\\begin{document}\n';
        this.documento.contenido += '\\maketitle\n';
        this.documento.contenido += '\\end{document}\n';
      break;
      case 'ieee':
        this.documento.contenido = '\\documentclass[conference]{IEEEtran}\n';
        this.documento.contenido += '\\usepackage[utf8]{inputenc}\n';
        this.documento.contenido += '\\usepackage{cite}\n';
        this.documento.contenido += '\\usepackage{authblk}\n';
        this.documento.contenido += '\\author[1]{Primer Autor}\\author[2]{Segundo Autor}\n';
        this.documento.contenido += '\\affil[1]{Universidad\\authorcr Email: {\\tt correo.electronico@dominio.edu.ec}\\vspace{1.5ex}}\n';
        this.documento.contenido += '\\affil[2]{Universidad\\authorcr Email: {\\tt correo.electronico@dominio.edu.ec}\\vspace{-2ex}}\n';
        this.documento.contenido += '\\title{' + this.documento.nombre + '}\n';
        this.documento.contenido += '\\begin{document}\n';
        this.documento.contenido += '\\maketitle\n';
        this.documento.contenido += '\\begin{abstract}\n\\end{abstract}\n';
        this.documento.contenido += '\\begin{IEEEkeywords}\n\\end{IEEEkeywords}}\n';
        this.documento.contenido += '\\end{document}\n';
      break;
      case 'article':
        this.documento.contenido = '\\documentclass[12pts]{article}\n';
        this.documento.contenido += '\\title{' + this.documento.nombre + '}\n';
        this.documento.contenido += '\\begin{document}\n';
        this.documento.contenido += '\\maketitle\n';
        this.documento.contenido += '\\end{document}\n';
      break;
    }
  }
}
