import {
  describe,
  it,
  expect,
} from 'vitest';

const { Validator } = require("./setup.js");

describe("required if", function() {
  it("should fail", function() {
    const validator = new Validator({ desert: "icecream", flavour: "" }, { flavour: "required_if:desert,icecream" });
    expect(validator.fails()).to.be.true;
    expect(validator.passes()).to.be.false;
    expect(validator.errors.first("flavour")).to.equal("validation.required.if");
  });

  it("should pass", function() {
    const validator = new Validator(
      { desert: "icecream", flavour: "chocolate" },
      { flavour: "required_if:desert,icecream" }
    );
    expect(validator.passes()).to.be.true;
    expect(validator.fails()).to.be.false;
  });
});
