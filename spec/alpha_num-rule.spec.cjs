import {
  describe,
  it,
  expect,
} from 'vitest';

const { Validator } = require("./setup.cjs");

describe("alpha_num validation rule", function() {
  it("should fail with non-alphanumeric characters", function() {
    const validator = new Validator({ age: "$" }, { age: "alpha_num" });
    expect(validator.fails()).to.be.true;
    expect(validator.passes()).to.be.false;
    expect(validator.errors.first("age").message).to.equal("validation.alpha_num");
  });

  it("should pass with only alphanumeric characters", function() {
    const validator = new Validator({ age: "abc123" }, { age: "alpha_num" });
    expect(validator.passes()).to.be.true;
    expect(validator.fails()).to.be.false;
  });

  it("should pass with only numeric characters", function() {
    const validator = new Validator({ age: 123 }, { age: "alpha_num" });
    expect(validator.passes()).to.be.true;
    expect(validator.fails()).to.be.false;
  });

  it("should pass when the field is blank / optional", function() {
    const validator = new Validator({ name: "" }, { name: "alpha_num" });
    expect(validator.passes()).to.be.true;
  });

  it("should pass when the field does not exist", function() {
    const validator = new Validator(
      {},
      {
        name: "alpha_num"
      }
    );
    expect(validator.passes()).to.be.true;
    expect(validator.fails()).to.be.false;
  });
});
