import { FotoPerfil } from './../../entidades/CRUD/FotoPerfil';
import { Usuario } from './../../entidades/CRUD/Usuario';
import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { environment } from './../../../environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  username: string;
  fotoPerfil: string;
  usuario: Usuario;
  webServiceURL = environment.apiUrl;

  constructor(private http: Http, public router: Router) { }

  ngOnInit() {
    this.usuario = JSON.parse(sessionStorage.getItem('usuario')) as Usuario;
    this.username = this.usuario.nombres + ' ' + this.usuario.apellidos;
    this.getFotoPerfil();
  }

  getFotoPerfil() {
    const data = {columna: 'idUsuario', tipo_filtro: 'coincide', filtro: this.usuario.id};
    this.http.post(this.webServiceURL + 'fotoperfil/leer_filtrado', JSON.stringify(data))
      .subscribe(r1 => {
        if ( r1.json()[0] === 0 ) {
          this.fotoPerfil = 'assets/images/usuario.png';
          return;
        }
        const fotografia: FotoPerfil = r1.json()[0] as FotoPerfil;
        this.fotoPerfil = 'data:' + fotografia.tipoArchivo + ';base64,' + fotografia.adjunto;
      }, error => {

    });
  }

  cerrarSesion() {
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }
}
