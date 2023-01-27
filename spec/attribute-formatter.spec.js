import {
  describe,
  it,
  expect,
} from 'vitest';

const { Validator } = require("./setup.js");

describe("attribute formatter tests", function() {
  it("should replace _[] with spaces by default", function() {
    const validator = new Validator({ "all_users[3][first_name]": "" }, { "all_users[3][first_name]": "required" });
    expect(validator.fails()).to.be.true;
    expect(validator.errors.first("all_users[3][first_name]")).to.equal(
        "validation.required"
    );
  });

  it("should be able configure global attribute formatter", function() {
    const originalAttributeFormatter = Validator.prototype.attributeFormatter;
    Validator.setAttributeFormatter(function(attribute) {
      return attribute.replace(/_/, " ");
    });
    const validator = new Validator({ first_name: "" }, { first_name: "required" });
    expect(validator.fails()).to.be.true;
    expect(validator.errors.first("first_name")).to.equal("validation.required");
    Validator.setAttributeFormatter(originalAttributeFormatter);
  });

  it("should be able configure attribute formatter for particular instance", function() {
    const validator = new Validator({ first_name: "" }, { first_name: "required" });
    validator.setAttributeFormatter(function(attribute) {
      return attribute;
    });
    expect(validator.fails()).to.be.true;
    expect(validator.errors.first("first_name")).to.equal("validation.required");
  });
});
