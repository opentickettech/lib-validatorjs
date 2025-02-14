import {
  describe,
  it,
  expect,
} from 'vitest';

const { Validator } = require("./setup.cjs");

describe("passes()", function() {
  it("should not duplicate error messages when called multiple times", function() {
    const validator = new Validator({}, { login: "required" });

    validator.passes();
    validator.passes();

    expect(validator.errors.first("login").message).to.equal("validation.required");
  });

  it("should work if the input doesn't extend Object", function() {
    // This happens in Express's req.body, for example.
    const body = Object.create(null);
    body.a = 2;

    const validator = new Validator(body, { a: "required" });

    expect(validator.passes()).to.be.true;
    expect(validator.fails()).to.be.false;
  });
});
