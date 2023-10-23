import {
  describe,
  it,
  expect,
} from 'vitest';

const { Validator } = require("./setup.cjs");

describe("required with", function() {
  it("should fail", function() {
    const validator = new Validator(
      {
        desert: {
          first: "icecream"
        },
        flavour: ""
      },
      { flavour: "required_with:desert.first" }
    );
    expect(validator.fails()).to.be.true;
    expect(validator.passes()).to.be.false;
    expect(validator.errors.first("flavour").message).to.equal("validation.required_with");
  });

  it("should pass", function() {
    const validator = new Validator(
      {
        desert: {
          first: "icecream"
        },
        flavour: "chocolate"
      },
      {
        flavour: "required_with:desert.first"
      }
    );
    expect(validator.passes()).to.be.true;
    expect(validator.fails()).to.be.false;
  });
});
