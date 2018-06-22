import { Usuario } from './../../entidades/CRUD/Usuario';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  username: string;

  constructor() { }

  ngOnInit() {
    const usuario = JSON.parse(sessionStorage.getItem('usuario')) as Usuario;
    this.username = usuario.nombres + ' ' + usuario.apellidos;
  }

}
