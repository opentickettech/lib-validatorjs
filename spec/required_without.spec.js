import {
    describe,
    it,
} from 'vitest';

const { Validator, expect } = require("./setup.js");

describe("required without", function() {
  it("should fail", function() {
    const validator = new Validator(
      {
        desert: {
          first: "icecream"
        },
        flavour: ""
      },
      {
        flavour: "required_without:desert.second"
      }
    );
    expect(validator.fails()).to.be.true;
    expect(validator.passes()).to.be.false;
    expect(validator.errors.first("flavour")).to.equal("validation.required.without");
  });

  it("should pass", function() {
    const validator = new Validator(
      {
        desert: {
          first: "icecream",
          second: "icecream"
        },
        flavour: ""
      },
      {
        flavour: "required_without:desert.second"
      }
    );
    expect(validator.passes()).to.be.true;
    expect(validator.fails()).to.be.false;
  });
});
