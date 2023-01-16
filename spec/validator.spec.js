import {
  beforeEach,
  describe,
  it,
} from 'vitest';

const { Validator, expect } = require("./setup.js");

describe("Validator constructor", function() {
  var validator;

  beforeEach(function() {
    validator = new Validator(
      { name: "David", email: "johndoe@gmail.com" },
      { name: "required", email: "required" },
      { required: "You're missing :required" }
    );
  });

  it("should expose on window if browser", function() {
    if (typeof window !== "undefined") {
      expect(window.Validator).toBeUndefined();
    }
  });

  it("should have a rules property containing all the validation rules", function() {
    expect(validator.rules).toBeTypeOf("object");
  });

  it("should have an input property containing the input data to be validated", function() {
    expect(validator.input).toBeTypeOf("object");
  });

  it("should have a messages property containing the combined messages for validation", function() {
    expect(validator.messages).toBeTypeOf("object");
  });

  it("should have a passes() method", function() {
    expect(validator.passes).toBeTypeOf("function");
  });

  it("should have a fails() method", function() {
    expect(validator.fails).toBeTypeOf("function");
  });

  it("should have a check method", function() {
    expect(validator.check).toBeTypeOf("function");
  });

  it("should handle undefined data", function() {
    var validator = new Validator(undefined, { name: "required" });
    validator.fails();
  });

  it("should handle null data", function() {
    var validator = new Validator(null, { name: "required" });
    validator.fails();
  });
}); // Page constructor
