import {
  describe,
  it,
} from 'vitest';

const { Validator, expect } = require("./setup.js");

describe("after rule", function() {
  it("should fail when the comparing attribute are greather", function() {
    const validator = new Validator({ date: "1996-12-09", date2: "1995-08-09" }, { date2: "after:date" });

    expect(validator.fails()).to.be.true;
    expect(validator.passes()).to.be.false;
    expect(validator.errors.first("date2")).to.equal("The date2 attribute has errors.");
  });

  it("should fail when the comparing attribute are equal", function() {
    const validator = new Validator({ date: "1995-08-09", date2: "1995-08-09" }, { date2: "after:date" });

    expect(validator.fails()).to.be.true;
    expect(validator.passes()).to.be.false;
    expect(validator.errors.first("date2")).to.equal("The date2 attribute has errors.");
  });

  it("should pass when the comparing attribute are smaller", function() {
    const validator = new Validator({ date: "1995-08-09", date2: "1996-12-09" }, { date2: "after:date" });

    expect(validator.fails()).to.be.false;
    expect(validator.passes()).to.be.true;
  });
});
