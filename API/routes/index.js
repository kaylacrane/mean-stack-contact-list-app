var express = require("express");
var router = express.Router();

// GET para cuando se accede la página principal
router.get("/", function (request, response, next) {
  setTimeout(function () {
    try {
      response.render("index");
    } catch (err) {
      next(err);
    }
  }, 100);
});

module.exports = router;
