import {
  describe,
  it,
  expect,
} from 'vitest';

const { Validator } = require("./setup.cjs");

describe("required without all", function() {
  it("should fail", function() {
    const validator = new Validator(
      {
        flavour: ""
      },
      {
        flavour: "required_without_all:desert.first,desert.second"
      }
    );
    expect(validator.fails()).to.be.true;
    expect(validator.passes()).to.be.false;
    expect(validator.errors.first("flavour").message).to.equal(
      "validation.required_without_all"
    );
  });

  it("should pass", function() {
    const validator = new Validator(
      {
        flavour: "chocolate"
      },
      {
        flavour: "required_without_all:desert.first,desert.second"
      }
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
        flavour: "required_without_all:desert.first,desert.second"
      }
    );
    expect(validator.passes()).to.be.true;
    expect(validator.fails()).to.be.false;
  });
});
