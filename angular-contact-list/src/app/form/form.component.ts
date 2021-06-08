import { Component, DoCheck, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Person } from "../interfaces/person";
import { DataService } from "../services/data.service";


@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.sass']
})
  
export class FormComponent implements OnInit, DoCheck {
  //variables de contacto
  contactForm = new FormGroup({});
  person: Person = {
    firstName: "",
    lastName: "",
    age: "",
    dni: "",
    birthday: "",
    favColor: "",
    gender: "",
    _id:"-1"
  };
  contactList: Person[] = [];
  contactId: string = "-1";

  //variables que se usan en el formulario
  genderChoices: string[] = ["female", "male", "other", "no answer"];
  colorChoices: string[] = ["red", "green", "blue", "purple", "orange", "yellow", "black"];
  formError: boolean = false;
  dniRegex: any = /([a-z]|[A-Z]|[0-9])[0-9]{7}([a-z]|[A-Z]|[0-9])/i;

  //para acceder al servicio (lista de contactos y contacto a modificar) y 
  //para usar el FormBuilder (validación del formulario/control de datos introducidos)
  constructor(private _formBuilder: FormBuilder, private _dataService: DataService) {
  }
  //para limpiar el formulario y tener todo listo para añadir otro contacto
  resetFormValues(): void {
    this.contactForm = this._formBuilder.group({
      firstName: ["", [Validators.required, Validators.minLength(3)]],
      lastName: ["", [Validators.required, Validators.minLength(3)]],
      age: ["", Validators.required],
      dni: ["", [Validators.required, Validators.minLength(9), Validators.maxLength(9), Validators.pattern(this.dniRegex)]],
      birthday: ["", Validators.required],
      favColor: ["", Validators.required],
      gender: ["no answer", Validators.required],
      _id: "-1",
    });
    this.formError = false;
    this.contactId = "-1";
  }
  ngOnInit(): void {
    //incializar el formulario al arrancar
    this.resetFormValues();
    //coger lista de contactos que ya existen si es el caso
    this.contactList = this._dataService.getContactList();
  }

  ngDoCheck() {
    //para cuando hay cambios en el componente de listado (botones de borrar/modificar contacto)
    this.contactList = this._dataService.getContactList();
    if (this._dataService.getContactId() !== "-1") {
      //recoger el id del servicio y guardarlo en una variable local
      this.contactId = this._dataService.getContactId();
      //rellenar el formulario con los datos del contacto a modificar
      let contactToEdit: Person | undefined = this.contactList.find(contact => contact._id === this.contactId);
      this.contactForm.setValue(contactToEdit ? contactToEdit : this.person);
      //si no reinicializamos el id en el servicio no podremos modificar nada en el formulario
      this._dataService.setContactId("-1");
    } 
  }
  //función que se dispara cuando guardamos un contacto
  saveContact(): void {
    //recoger datos del formulario
    this.person = this.contactForm.value;
    //si el formulario no es válido aparece un mensaje de error por debajo del formulario
    if (!this.contactForm.valid) {
      this.formError = true;
    } else {
      //actualizar o añadir contactos según el id
        this._dataService.updateContactList(this.person, this.contactId);
      //limpiar el formulario para poder añadir más contactos
      this.resetFormValues();
      }
  }
}