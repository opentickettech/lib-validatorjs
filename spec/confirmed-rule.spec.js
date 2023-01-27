import {
  describe,
  it,
  expect,
} from 'vitest';

const { Validator } = require("./setup.js");

describe("confirmed validation rule", function() {
  it("should fail without a matching confirmation field for the field under validation", function() {
    const validator = new Validator({ password: "abc" }, { password: "confirmed" });
    expect(validator.passes()).to.be.false;
    expect(validator.fails()).to.be.true;
  });

  it("should fail without a matching confirmation field for the field under validation", function() {
    const validator = new Validator({ password: "abc", password_confirmation: "abcd" }, { password: "confirmed" });
    expect(validator.passes()).to.be.false;
    expect(validator.fails()).to.be.true;
    expect(validator.errors.first("password")).to.equal("validation.confirmed");
  });

  it("should pass with a matching confirmation field for the field under validation", function() {
    const validator = new Validator({ password: "abc", password_confirmation: "abc" }, { password: "confirmed" });
    expect(validator.passes()).to.be.true;
    expect(validator.fails()).to.be.false;
  });
});
