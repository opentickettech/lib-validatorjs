import {
  describe,
  it,
  expect,
} from 'vitest';

const { Validator } = require("./setup.cjs");

describe("after or equal rule", function() {
  it("should fail when the comparing attribute are greather", function() {
    const validator = new Validator({ date: "1996-12-09", date2: "1995-08-09" }, { date2: "after_or_equal:date" });

    expect(validator.fails()).to.be.true;
    expect(validator.passes()).to.be.false;
    expect(validator.errors.first("date2").message).to.equal("validation.after_or_equal");
  });

  it("should pass when the comparing attribute are equal", function() {
    const validator = new Validator({ date: "1995-08-09", date2: "1995-08-09" }, { date2: "after_or_equal:date" });

    expect(validator.fails()).to.be.false;
    expect(validator.passes()).to.be.true;
  });

  it("should pass when the comparing attribute are smaller", function() {
    const validator = new Validator({ date: "1995-08-09", date2: "1996-12-09" }, { date2: "after_or_equal:date" });

    expect(validator.fails()).to.be.false;
    expect(validator.passes()).to.be.true;
  });
});
