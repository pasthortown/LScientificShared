import { environment } from './../../../environments/environment';
import { FotoPerfil } from './../../entidades/CRUD/FotoPerfil';
import { Http } from '@angular/http';
import { Usuario } from './../../entidades/CRUD/Usuario';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Cuenta } from '../../entidades/CRUD/Cuenta';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  @ViewChild('fileInput') fileInput;
  usuario: Usuario;
  cuenta: Cuenta;
  cambiandoClave: Boolean;
  validarClave: Boolean;
  confirmarNuevaClave: string;
  claveNueva: string;
  srcFoto: string;
  fotografia: FotoPerfil;
  webServiceURL = environment.apiUrl;
  fotoNueva: Boolean;

  constructor(public http: Http, public router: Router) { }

  ngOnInit() {
    this.usuario = new Usuario();
    this.cuenta = new Cuenta();
    this.fotografia = new FotoPerfil();
    this.usuario = JSON.parse(sessionStorage.getItem('usuario')) as Usuario;
    this.fotografia.idUsuario = this.usuario.id;
    this.cuenta.idUsuario = this.usuario.id;
    this.validarClaveEvent();
    this.validarClave = false;
    this.cambiandoClave = false;
    this.getFotoPerfil();
  }

  getFotoPerfil() {
    const data = {columna: 'idUsuario', tipo_filtro: 'coincide', filtro: this.usuario.id};
    this.http.post(this.webServiceURL + 'fotoperfil/leer_filtrado', JSON.stringify(data))
      .subscribe(r1 => {
        if ( r1.json()[0] === 0 ) {
          this.srcFoto = 'assets/images/usuario.png';
          return;
        }
        this.fotografia = r1.json()[0] as FotoPerfil;
        this.srcFoto = 'data:' + this.fotografia.tipoArchivo + ';base64,' + this.fotografia.adjunto;
      }, error => {

    });
  }

  validarClaveEvent() {
    if ( this.claveNueva == null || this.claveNueva === '') {
      this.cambiandoClave = false;
    } else {
      this.cambiandoClave = true;
      if ( this.claveNueva === null || this.claveNueva === '' || this.confirmarNuevaClave === null || this.confirmarNuevaClave === '' || this.confirmarNuevaClave !== this.claveNueva ) {
          this.validarClave = false;
      } else {
          this.validarClave = true;
      }
    }
  }

  updateClave() {
    if ( !this.validarClave ) {
      return;
    }
    if ( !this.cambiandoClave ) {
      return;
    }
    this.http.get(this.webServiceURL + 'cuenta/leer_filtrado?columna=idUsuario&tipo_filtro=coincide&filtro=' + this.usuario.id.toString())
      .subscribe(r => {
        const account = r.json()[0] as Cuenta;
        this.cuenta.id = account.id;
        this.cuenta.clave = this.claveNueva;
        this.http.post(this.webServiceURL + 'cuenta/actualizar', JSON.stringify(this.cuenta))
        .subscribe(r1 => {
          this.router.navigate(['/login']);
        }, error => {
        });
      }, error => {
      });
  }

  update() {
    this.http.post(this.webServiceURL + 'usuario/actualizar', JSON.stringify(this.usuario))
    .subscribe(r1 => {
      this.router.navigate(['/login']);
    }, error => {
    });
  }

  actualizarCuenta() {
    if ( this.fotoNueva ) {
      this.http.get(this.webServiceURL + 'fotoperfil/leer_filtrado?columna=idUsuario&tipo_filtro=coincide&filtro=' + this.usuario.id.toString())
      .subscribe(r => {
        if ( r.json()[0] === 0 ) {
          this.http.post(this.webServiceURL + 'fotoperfil/crear', JSON.stringify(this.fotografia))
          .subscribe(r1 => {
            this.update();
          }, error => {
          });
        } else {
          const foto = r.json()[0] as FotoPerfil;
          this.fotografia.id = foto.id;
          this.http.post(this.webServiceURL + 'fotoperfil/actualizar', JSON.stringify(this.fotografia))
          .subscribe(r1 => {
            this.update();
          }, error => {
          });
        }
      }, error => {
      });
    } else {
      this.update();
    }
  }

  CodificarArchivo(event) {
    this.fotoNueva = false;
    const reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.fotografia.nombreArchivo = file.name;
        this.fotografia.tipoArchivo = file.type;
        this.fotografia.adjunto = reader.result.split(',')[1];
        this.srcFoto = 'data:' + this.fotografia.tipoArchivo + ';base64,' + this.fotografia.adjunto;
        this.fotoNueva = true;
      };
    }
  }
}
