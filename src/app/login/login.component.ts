import { environment } from './../../environments/environment';
import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  email: string;
  clave: string;
  webServiceURL = environment.apiUrl;

  constructor(private http: Http) { }

  ngOnInit() {
  }

  ingresar() {
    const data = {email: this.email, clave: this.clave};
    this.http.post(this.webServiceURL + 'login/cuenta', JSON.stringify(data))
    .subscribe(r1 => {
      if ( JSON.stringify(r1.json()) === 'false') {
        return;
      }
      console.log(r1);
    }, error => {

    });
  }

  recuperarClave() {
    const data = {email: this.email, accion: 'Recuperar Clave'};
    this.http.post(this.webServiceURL + 'login/passwordChange', JSON.stringify(data))
    .subscribe(r1 => {
      if ( JSON.stringify(r1.json()) === '[0]') {
        return;
      }
      console.log(r1);
    }, error => {

    });
  }
}
