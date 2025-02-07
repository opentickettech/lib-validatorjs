import {
  describe,
  it,
  expect,
} from 'vitest';

const { Validator } = require("./setup.cjs");

describe("in validation rule", function() {
  it("should fail when the value is not in the set of comma separated values", function() {
    const validator = new Validator({ state: "fakeState" }, { state: "in:CA,TX,FL" });
    expect(validator.passes()).to.be.false;
    expect(validator.fails()).to.be.true;
    expect(validator.errors.first("state").message).to.equal("validation.in");
  });

  it("should pass when the value is in the set of comma separated values", function() {
    const validator = new Validator({ state: "CA" }, { state: "in:CA,TX,FL" });
    expect(validator.passes()).to.be.true;
    expect(validator.fails()).to.be.false;
  });

  it("should pass when the value is undefined", function() {
    const validator = new Validator({}, { state: "in:CA,TX,FL" });
    expect(validator.passes()).to.be.true;
    expect(validator.fails()).to.be.false;
  });

  it("should pass when the value is an empty string", function() {
    const validator = new Validator({ state: "" }, { state: "in:CA,TX,FL" });
    expect(validator.passes()).to.be.true;
    expect(validator.fails()).to.be.false;
  });

  it("should fail when the numeric value is not in the set of comma separated values", function() {
    const validator = new Validator({ quantity: 10 }, { quantity: "in:0,1,2" });
    expect(validator.passes()).to.be.false;
    expect(validator.fails()).to.be.true;
    expect(validator.errors.first("quantity").message).to.equal("validation.in");
  });

  it("should pass when the value is in the set of comma separated values", function() {
    const validator = new Validator(
      {
        quantity: 1
      },
      {
        quantity: "in:0,1,2"
      }
    );
    expect(validator.passes()).to.be.true;
    expect(validator.fails()).to.be.false;
  });

  it("should pass when all values are present", function() {
    const validator = new Validator({ fruits: ["apple", "strawberry"] }, { fruits: "array|in:apple,strawberry,kiwi" });

    expect(validator.passes()).to.be.true;
  });

  it("should fail when not all values are present", function() {
    const validator = new Validator({ fruits: ["strawberry", "kiwi"] }, { fruits: "array|in:apple,strawberry" });

    expect(validator.passes()).to.be.false;
  });
});
