// importar mongodb y fichero con base de datos:
var db = require("../database/db");
var mongodb = require("mongodb");

// para ver errores de validación de request
const { validationResult } = require("express-validator");

// conectar a base de datos
db.connect("mongodb://localhost:27017", function (error) {
  if (error) {
    console.log(error);
    throw "Error connecting to database";
  }
});

// devolver lista de todos los contactos guardados en base de datos
module.exports.get_all_contacts = function (request, response) {
  //comprobar conexión
  if (db.get() === null) {
    next(new Error("No connection found"));
    return;
  }
  db.get()
    .db("contact_list")
    .collection("contacts")
    .find() //sin filtro para devolverlo todo
    .toArray(function (error, result) {
      if (error) {
        console.log(error);
        throw "Error connecting to database";
      } else {
        //enviar resultado si hubo éxito
        response.send(result);
      }
    });
};

// devolver un contacto buscando por su id (parámetros/url)
module.exports.get_one_contact = function (request, response) {
  //comprobar conexión
  if (db.get() === null) {
    next(new Error("No connection found"));
    return;
  }
  const { id } = request.params;
  const filter = { _id: new mongodb.ObjectID(id) };
  db.get()
    .db("contact_list")
    .collection("contacts")
    .find(filter)
    .toArray(function (error, result) {
      if (error) {
        throw "Error connecting to database";
      } else if (result.length === 0) {
        //si no se encuentra contact con el id proporcionado
        response.send(`No contact found with id: ${id}`);
      } else {
        //enviar resultado si hubo éxito
        response.send(result);
      }
    });
};

// crear nuevo contacto
module.exports.create_one_contact = function (request, response, next) {
  //comprobar conexión
  if (db.get() === null) {
    next(new Error("No connection found"));
    return;
  }
  //validar petición
  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    return response.status(422).json({ errors: errors.array() });
  }
  //juntar datos de request en un objeto que representa un contacto
  const contactInfo = {
    firstName: request.body.firstName,
    lastName: request.body.lastName,
    age: request.body.age,
    dni: request.body.dni,
    birthday: request.body.birthday,
    favColor: request.body.favColor,
    gender: request.body.gender,
  };
  db.get()
    .db("contact_list")
    .collection("contacts")
    .insertOne(contactInfo, function (error, result) {
      if (error) {
        throw "Create new contact failed";
      } else {
        //enviar resultado si hubo éxito
        response.send(result);
      }
    });
};

// modificar contacto (id en parámetros/url)
module.exports.update_one_contact = function (request, response, next) {
  //comprobar conexión
  if (db.get() === null) {
    next(new Error("No connection found"));
    return;
  }
  //validar petición
  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    return response.status(422).json({ errors: errors.array() });
  }
  const { params, body } = request;
  //crear filtro para encontrar contacto por id que viene de parámetros (URL)
  const filter = { _id: new mongodb.ObjectID(params.id) };
  //recoger datos del body en objeto de contacto
  const updatedContact = {
    $set: {
      firstName: body.firstName,
      lastName: body.lastName,
      age: body.age,
      dni: body.dni,
      birthday: body.birthday,
      favColor: body.favColor,
      gender: body.gender,
    },
  };

  db.get()
    .db("contact_list")
    .collection("contacts")
    .updateOne(filter, updatedContact, function (error, result) {
      if (error) {
        next(new Error(`Update contact with id: ${params.id} failed`));
        return;
      } else {
        //enviar resultado si hubo éxito
        response.send(result);
      }
    });
};

// borrar contacto por id (parámetro/url)
module.exports.delete_one_contact = function (request, response, next) {
  //comprobar conexión
  if (db.get() === null) {
    next(new Error("No connection found"));
    return;
  }
  const { id } = request.params;
  //filtro para encontrar contacto a borrar (ID enviado por parámetros (URL))
  const filter = { _id: new mongodb.ObjectID(id) };
  db.get()
    .db("contact_list")
    .collection("contacts")
    .deleteOne(filter, function (error, result) {
      if (error) {
        next(new Error(`Delete contact with id: ${id} failed`));
        return;
      } else if (result.deletedCount !== 1) {
        //si no se encuentra contact con el id proporcionado
        response.send(`No contact found with id: ${id}`);
      } else {
        //enviar resultado si hubo éxito
        response.send(result);
      }
    });
};

// borrar contacto por id (body)
module.exports.delete_one_contact_body = function (request, response, next) {
  //comprobar conexión
  if (db.get() === null) {
    next(new Error("No connection found"));
    return;
  }
  const { id } = request.body;
  //filtro para encontrar contacto a borrar (ID enviado por cuerpo de request)
  const filter = { _id: new mongodb.ObjectID(id) };
  db.get()
    .db("contact_list")
    .collection("contacts")
    .deleteOne(filter, function (error, result) {
      if (error) {
        next(new Error(`Delete contact with id: ${id} failed`));
        return;
      } else if (result.deletedCount === 0) {
        //si no se encuentra contact con el id proporcionado
        response.send(`No contact found with id: ${id}`);
      } else {
        //enviar resultado si hubo éxito
        response.send(result);
      }
    });
};

// borrar TODOS los contactos
module.exports.delete_all_contacts = function (request, response, next) {
  //comprobar conexión
  if (db.get() === null) {
    next(new Error("No connection found"));
    return;
  }
  db.get()
    .db("contact_list")
    .collection("contacts")
    .deleteMany({}, function (error, result) {
      //aquí el filtro es un {} vacío para borrar TODOS los contactos
      if (error) {
        next(new Error("Delete all contacts failed"));
        return;
      } else {
        //enviar resultado si hubo éxito
        response.send(result);
      }
    });
};
