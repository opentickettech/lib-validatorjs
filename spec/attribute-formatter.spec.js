import {
  describe,
  it,
} from 'vitest';

const { Validator, expect } = require("./setup.js");

describe("attribute formatter tests", function() {
  it("should replace _[] with spaces by default", function() {
    const validator = new Validator({ "all_users[3][first_name]": "" }, { "all_users[3][first_name]": "required" });
    expect(validator.fails()).to.be.true;
    expect(validator.errors.first("all_users[3][first_name]")).to.equal(
      "The all users 3 first name attribute has errors."
    );
  });

  it("should be able configure global attribute formatter", function() {
    const originalAttributeFormatter = Validator.prototype.attributeFormatter;
    Validator.setAttributeFormatter(function(attribute) {
      return attribute.replace(/_/, " ");
    });
    const validator = new Validator({ first_name: "" }, { first_name: "required" });
    expect(validator.fails()).to.be.true;
    expect(validator.errors.first("first_name")).to.equal("The first name attribute has errors.");
    Validator.setAttributeFormatter(originalAttributeFormatter);
  });

  it("should be able configure attribute formatter for particular instance", function() {
    const validator = new Validator({ first_name: "" }, { first_name: "required" });
    validator.setAttributeFormatter(function(attribute) {
      return attribute;
    });
    expect(validator.fails()).to.be.true;
    expect(validator.errors.first("first_name")).to.equal("The first_name attribute has errors.");
  });
});
