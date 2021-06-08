import { Injectable } from '@angular/core';
import { Person } from "../interfaces/person";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
  
  //este servicio maneja los datos que se comparten entre los componentes de formulario y lista de contactos
export class DataService {
  //variables 
  private _contactList: Person[] = [];
  private _contactId: string = "-1";
  private _headers: HttpHeaders;
  private _baseApiUrl: string = environment.baseUrlApi;

  constructor(private http: HttpClient) {
    //coger datos de mongodb al arrancar servicio
    this.http.get<Person[]>(`${this._baseApiUrl}/`).subscribe((data) => {
      this._contactList = data;
    })
    //crear las headers
    this._headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
  }

  //funciones para manejar el id del contacto a modificar
  setContactId(id: string) {
    this._contactId = id;
  }
  getContactId() {
    return this._contactId;
  }
  //devolver lista entera de contactos 
  getContactList(): Person[] {
    return this._contactList;
  }

  //actualizar la lista de contactos empleando un id
  updateContactList(person: Person, id: string) {
    //un id de '-1' significa añadir contacto nuevo
    if (id === "-1") {
      this.http.post(`${this._baseApiUrl}/add/`, person,{headers: this._headers} ).subscribe(() => {
        this.http.get<Person[]>(`${this._baseApiUrl}/`).subscribe(data => {
          this._contactList = data;
        })
      })
      //cualquier otro id es para modificar un contacto ya guardado en base de datos
    } else if (id !== "-1") {
      this.http.put(`${this._baseApiUrl}/edit/${id}`, person,{headers: this._headers} ).subscribe(() => {
        this.http.get<Person[]>(`${this._baseApiUrl}/`).subscribe(data => {
          this._contactList = data;
        })
      })
    }
  }
  //borrar un contacto usando su id
  deleteContact(id:string): void{
    this.http.delete(`${this._baseApiUrl}/delete/${id}`,{headers: this._headers} ).subscribe(() => {
        this.http.get<Person[]>(`${this._baseApiUrl}/`).subscribe(data => {
          this._contactList = data;
        })
      })
  }
  deleteAllContacts(): void{
    this.http.delete(`${this._baseApiUrl}/clear/`,{headers: this._headers} ).subscribe(() => {
      this.http.get<Person[]>(`${this._baseApiUrl}/`).subscribe(data => {
        this._contactList = data;
      })
    })
  }
}
