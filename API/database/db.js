// crear cliente mongodb
var MongoClient = require("mongodb").MongoClient;

// conexión a la base de datos
var db = null;
module.exports.connect = function (url, callback) {
  // por si ya está conectado
  if (db) {
    return callback();
  }

  // crear la instancia de mongodb:
  const client = new MongoClient(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  // conectar cliente y servidor:
  client.connect(function (error, result) {
    if (error) {
      return callback(error);
    }
    console.log("Database is connected");
    db = result;
    callback();
  });
};

// función para terminar conexión
module.exports.close = function () {
  if (db) {
    db.close(function (error, result) {
      console.log("Database disconnected");
      console.log(result);
      db = null;
      callback(error);
    });
  }
};

// para obtener mongodb conectado
module.exports.get = function () {
  return db;
};
