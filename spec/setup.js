if (typeof require !== "undefined") {
  var Validator = require("../src/validator.js");
} else {
  var Validator = window.Validator;
}

module.exports = { Validator };
