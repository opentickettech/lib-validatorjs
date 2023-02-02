var Validator;

if (typeof require !== "undefined") {
  Validator = require("../src/validator.cjs");
} else {
  Validator = window.Validator;
}

module.exports = { Validator };
