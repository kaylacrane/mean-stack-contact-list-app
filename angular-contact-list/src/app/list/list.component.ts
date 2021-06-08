import { Component, DoCheck } from '@angular/core';
import { Person } from "../interfaces/person";
import { DataService } from "../services/data.service";

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.sass']
})
export class ListComponent implements DoCheck {
  //variables
  contactList: Person[] = [];

  //recogemos la lista de contactos del servicio
  constructor(private _dataService: DataService) {
    this.contactList = this._dataService.getContactList();
  }
  
  ngDoCheck(): void {
    //para actualizar list.component.html cuando hay cambios
    this.contactList = this._dataService.getContactList();
  }
  //para enseñar la fecha en formato aaaa-mm-dd
  formatDate(birthday: any): string {
    let date = new Date(birthday).toLocaleString().split(' ')[0].split("/");
    let day = date[0];
    let month = date[1];
    let year = date[2];
    return `${year}-${month}-${day}`;
  }

  //al hacer clic en botón de Edit, guardamos el id de ese contacto. Este cambio de id provoca el relleno del formulario con los datos del contacto
  editContact(id: string) {
    this._dataService.setContactId(id);
  }
  //al hacer clic en el botón de Delete, borramos el contacto usando su id (llamando el método en el servicio)
  deleteContact(id: string) {
    this._dataService.deleteContact(id);
  }
  deleteAllContacts(): void{
    this._dataService.deleteAllContacts();
  }
}
