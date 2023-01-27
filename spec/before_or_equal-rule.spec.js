import {
  describe,
  it,
  expect,
} from 'vitest';

const { Validator } = require("./setup.js");

describe("before or equal rule", function() {
  it("should fail when the comparing attribute are smaller", function() {
    const validator = new Validator({ date: "1994-12-09", date2: "1998-08-09" }, { date2: "before_or_equal:date" });

    expect(validator.fails()).to.be.true;
    expect(validator.passes()).to.be.false;
    expect(validator.errors.first("date2")).to.equal("validation.before_or_equal");
  });

  it("should pass when the comparing attribute are equal", function() {
    const validator = new Validator({ date: "1994-12-09", date2: "1994-12-09" }, { date2: "before_or_equal:date" });

    expect(validator.fails()).to.be.false;
    expect(validator.passes()).to.be.true;
  });

  it("should pass when the comparing attribute are greather", function() {
    const validator = new Validator({ date: "1998-08-09", date2: "1994-12-09" }, { date2: "before_or_equal:date" });

    expect(validator.fails()).to.be.false;
    expect(validator.passes()).to.be.true;
  });
});
