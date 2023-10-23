import {
  describe,
  it,
  expect,
} from 'vitest';

const { Validator } = require("./setup.cjs");

describe("required with all", function() {
  it("should fail", function() {
    const validator = new Validator(
      {
        desert: {
          first: "icecream",
          second: "icecream"
        },
        flavour: ""
      },
      { flavour: "required_with_all:desert.first,desert.second" }
    );
    expect(validator.fails()).to.be.true;
    expect(validator.passes()).to.be.false;
    expect(validator.errors.first("flavour").message).to.equal(
      "validation.required_with_all"
    );
  });

  it("should pass", function() {
    const validator = new Validator(
      {
        desert: {
          first: "icecream",
          second: "icecream"
        },
        flavour: "chocolate"
      },
      { flavour: "required_with_all:desert.first,desert.second" }
    );
    expect(validator.passes()).to.be.true;
    expect(validator.fails()).to.be.false;
  });

  it("should pass (not all required field are set)", function() {
    const validator = new Validator(
      {
        desert: {
          first: "icecream"
        },
        flavour: ""
      },
      {
        flavour: "required_with_all:desert.first,desert.second"
      }
    );
    expect(validator.passes()).to.be.true;
    expect(validator.fails()).to.be.false;
  });
});
