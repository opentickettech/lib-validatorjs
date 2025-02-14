import {
  describe,
  it,
  expect,
} from 'vitest';

const { Validator } = require("./setup.cjs");

describe("custom attribute names", function() {
  it("should allow custom attribute names", function() {
    const validator = new Validator({ name: "" }, { name: "required" });
    validator.setAttributeNames({
      name: "custom_name"
    });
    expect(validator.fails()).to.be.true;
    expect(validator.errors.first("name").message).to.equal("validation.required");
  });

  it("should use custom attribute names for replacements in required_if rule", function() {
    const validator = new Validator({ name: "", req: "is_required" }, { name: "required_if:req,is_required" });
    validator.setAttributeNames({
      name: "custom_name",
      req: "other_field"
    });
    expect(validator.fails()).to.be.true;
    expect(validator.errors.first("name").message).to.equal(
      "validation.required_if"
    );
  });

  it("should use custom attribute names for replacements in required_unless rule", function() {
    const validator = new Validator({ name: "", req: "not_required" }, { name: "required_unless:req,is_required" });
    validator.setAttributeNames({
      name: "custom_name",
      req: "other_field"
    });
    expect(validator.fails()).to.be.true;
    expect(validator.errors.first("name").message).to.equal(
      "validation.required_unless"
    );
  });

  it("should use custom attribute names for replacements in required_with rule", function() {
    const validator = new Validator({ name: "", req: true }, { name: "required_with:req" });
    validator.setAttributeNames({
      name: "custom_name",
      req: "other_field"
    });
    expect(validator.fails()).to.be.true;
    expect(validator.errors.first("name").message).to.equal("validation.required_with");
  });

  it("should use custom attribute names for replacements in required_with_all rule", function() {
    const validator = new Validator({ name: "", req1: true, req2: true }, { name: "required_with_all:req1,req2" });
    validator.setAttributeNames({
      name: "custom_name",
      req1: "other_field_1",
      req2: "other_field_2"
    });
    expect(validator.fails()).to.be.true;
    expect(validator.errors.first("name").message).to.equal(
      "validation.required_with_all"
    );
  });

  it("should use custom attribute names for replacements in required_without rule", function() {
    const validator = new Validator({ name: "" }, { name: "required_without:req" });
    validator.setAttributeNames({
      name: "custom_name",
      req: "other_field"
    });
    expect(validator.fails()).to.be.true;
    expect(validator.errors.first("name").message).to.equal("validation.required_without");
  });

  it("should use custom attribute names for replacements in required_without_all rule", function() {
    const validator = new Validator({ name: "" }, { name: "required_without_all:req1,req2" });
    validator.setAttributeNames({
      name: "custom_name",
      req1: "other_field_1",
      req2: "other_field_2"
    });
    expect(validator.fails()).to.be.true;
    expect(validator.errors.first("name").message).to.equal(
      "validation.required_without_all"
    );
  });

  it("should use custom attribute names for replacements in after rule", function() {
    const validator = new Validator(
      { date: new Date("2017-01-01"), other: new Date("2017-01-02") },
      { date: "after:other" }
    );
    validator.setAttributeNames({ date: "custom_name", other: "other_field" });
    expect(validator.fails()).to.be.true;
    expect(validator.errors.first("date").message).to.equal("validation.after");
  });

  it("should use custom attribute names for replacements in before rule", function() {
    const validator = new Validator(
      { date: new Date("2017-01-03"), other: new Date("2017-01-02") },
      { date: "before:other" }
    );
    validator.setAttributeNames({ date: "custom_name", other: "other_field" });
    expect(validator.fails()).to.be.true;
    expect(validator.errors.first("date").message).to.equal("validation.before");
  });

  it("should use custom attribute names for replacements in after_or_equal rule", function() {
    const validator = new Validator(
      { date: new Date("2017-01-01"), other: new Date("2017-01-02") },
      { date: "after_or_equal:other" }
    );
    validator.setAttributeNames({ date: "custom_name", other: "other_field" });
    expect(validator.fails()).to.be.true;
    expect(validator.errors.first("date").message).to.equal("validation.after_or_equal");
  });

  it("should use custom attribute names for replacements in before_or_equal rule", function() {
    const validator = new Validator(
      { date: new Date("2017-01-03"), other: new Date("2017-01-02") },
      { date: "before_or_equal:other" }
    );
    validator.setAttributeNames({
      date: "custom_name",
      other: "other_field"
    });
    expect(validator.fails()).to.be.true;
    expect(validator.errors.first("date").message).to.equal("validation.before_or_equal");
  });

  it("should use custom attribute names for replacements in same rule", function() {
    const validator = new Validator({ name: "name", other: "other" }, { name: "same:other" });
    validator.setAttributeNames({ name: "custom_name", other: "other_field" });
    expect(validator.fails()).to.be.true;
    expect(validator.errors.first("name").message).to.equal("validation.same");
  });
});
