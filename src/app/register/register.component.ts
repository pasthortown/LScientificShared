import { Usuario } from './../entidades/CRUD/Usuario';
import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { environment } from './../../environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  usuario: Usuario;
  webServiceURL = environment.apiUrl;

  constructor(private http: Http, public router: Router) {
  }

  ngOnInit() {
    this.usuario = new Usuario;
  }

  crearCuenta() {
    this.http.post(this.webServiceURL + 'cuentas/crear_cuenta', JSON.stringify(this.usuario))
    .subscribe(r1 => {
      this.router.navigate(['/login']);
    }, error => {

    });
  }
}
