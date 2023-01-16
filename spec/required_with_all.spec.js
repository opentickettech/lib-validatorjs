import {
    describe,
    it,
} from 'vitest';

const { Validator, expect } = require("./setup.js");

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
    expect(validator.errors.first("flavour")).to.equal(
      "validation.required.with.all"
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
