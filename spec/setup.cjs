if (typeof require !== "undefined") {
  var Validator = require("../src/validator.cjs");
} else {
  var Validator = window.Validator;
}

module.exports = { Validator };
