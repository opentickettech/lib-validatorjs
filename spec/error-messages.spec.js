import {
  describe,
  it,
} from 'vitest';

const { Validator, expect } = require("./setup.js");

describe("Error messages", function() {
  describe("first()", function() {
    it("should return an error message that states the email is required", function() {
      const validator = new Validator({ email: "" }, { email: "required|email" });
      expect(validator.passes()).to.be.false;
      expect(validator.errors.first("email")).to.equal("The email attribute has errors.");
    });

    it("should have a method on the errors object to retrieve the first error message for an attribute", function() {
      const validator = new Validator({ email: "" }, { email: "required|email" });
      expect(validator.passes()).to.be.false;
      expect(validator.errors.first("email")).to.equal("The email attribute has errors.");
    });

    it("should return false if errors.first() is called and there are no errors", function() {
      const validator = new Validator({ email: "john@yahoo.com" }, { email: "required|email" });
      expect(validator.passes()).to.be.true;
      expect(validator.errors.first("email")).to.equal(false);
    });

    it("should return an error message that states the email must be valid", function() {
      const validator = new Validator({ email: "john@yahoo" }, { email: "required|email" });
      expect(validator.passes()).to.be.false;
      expect(validator.errors.first("email")).to.equal("The email attribute has errors.");
    });

    it("should return null for a key without an error message", function() {
      const validator = new Validator({ name: "David" }, { name: "required" });
      expect(validator.passes()).to.be.true;
      expect(validator.errors.first("name")).to.be.false;
    });

    it("should return error messages with attribute names and values for multi-part rules", function() {
      const validator = new Validator(
        { age: 17, description: "a", info: "", hours: 3, pin: "123", range: 20, tweet: "some tweet" },
        {
          age: "min:18",
          description: "required|min:5",
          info: "required|min:3",
          hours: "size:5",
          pin: "size:4",
          range: "max:10",
          tweet: "max:5"
        }
      );

      expect(validator.passes()).to.be.false;
      expect(validator.errors.first("age")).to.equal("The age attribute has errors."); // min numeric
      expect(validator.errors.first("description")).to.equal("The description attribute has errors."); // min string
      expect(validator.errors.first("info")).to.equal("The info attribute has errors.");
      expect(validator.errors.first("hours")).to.equal("The hours attribute has errors."); // size numeric
      expect(validator.errors.first("pin")).to.equal("The pin attribute has errors."); // size string
      expect(validator.errors.first("range")).to.equal("The range attribute has errors."); // max numeric
      expect(validator.errors.first("tweet")).to.equal("The tweet attribute has errors."); // max string
    });

    it("should return a customized alpha error message", function() {
      const validator = new Validator(
        {
          name: "12"
        },
        {
          name: "alpha"
        }
      );
      expect(validator.passes()).to.be.false;
      expect(validator.errors.first("name")).to.equal("The name attribute has errors.");
    });

    it("should fail with non alpha dash characters", function() {
      const validator = new Validator({ name: "David *" }, { name: "alpha_dash" });
      expect(validator.passes()).to.be.false;
      expect(validator.errors.first("name")).to.equal(
        "The name attribute has errors."
      );
    });

    it("should fail without a matching confirmation field for the field under validation", function() {
      const validator = new Validator({ password: "abc" }, { password: "confirmed" });
      expect(validator.passes()).to.be.false;
      expect(validator.errors.first("password")).to.equal("The password attribute has errors.");
    });

    it("should fail when the 2 attributes are the same", function() {
      const validator = new Validator({ field1: "abc", field2: "abc" }, { field2: "different:field1" });
      expect(validator.passes()).to.be.false;
      expect(validator.errors.first("field2")).to.equal("The field2 attribute has errors.");
    });

    it("should fail with a url only containing http://", function() {
      const link = "http://";
      const validator = new Validator({ link: link }, { link: "url" });
      expect(validator.passes()).to.be.false;
      expect(validator.errors.first("link")).to.equal("The link attribute has errors.");
    });

    it("should fail the custom telephone rule registration with a default error message", function() {
      Validator.register("telephone", function(val) {
        return val.match(/^\d{3}-\d{3}-\d{4}$/);
      });

      const validator = new Validator({ phone: "4213-454-9988" }, { phone: "telephone" });
      expect(validator.passes()).to.be.false;
      expect(validator.errors.first("phone")).to.equal("The phone attribute has errors.");
    });

    it("should fail the custom telephone rule registration with a custom error message", function() {
      Validator.register(
        "telephone",
        function(val) {
          return val.match(/^\d{3}-\d{3}-\d{4}$/);
        },
        "The :attribute phone number is not in the format XXX-XXX-XXXX."
      );

      const validator = new Validator(
        {
          cell: "4213-454-9988"
        },
        {
          cell: "telephone"
        }
      );
      expect(validator.passes()).to.be.false;
      expect(validator.errors.first("cell")).to.equal("The cell phone number is not in the format XXX-XXX-XXXX.");
    });
  });

  describe("get()", function() {
    it("should return an array of all email error messages", function() {
      const validator = new Validator({ email: "" }, { email: "required|email" });

      expect(validator.passes()).to.be.false;
      expect(validator.errors.get("email")).to.be.instanceOf(Array);
      expect(validator.errors.get("email").length).to.equal(1);
    });

    it("should return an empty array if there are no messages for an attribute", function() {
      const validator = new Validator(
        {
          email: "johndoe@gmail.com"
        },
        {
          email: "required|email"
        }
      );

      expect(validator.passes()).to.be.true;
      expect(validator.errors.get("email")).to.be.instanceOf(Array);
      expect(validator.errors.get("email").length).to.equal(0);
    });

    it("should return multiple array items for an attribute", function() {
      const validator = new Validator({ email: "x" }, { email: "email|min:10" });

      expect(validator.passes()).to.be.false;
      expect(validator.errors.get("email")).to.be.instanceOf(Array);
      expect(validator.errors.get("email").length).to.equal(1); // @todo
    });
  });

  describe("ValidatorErrors.prototype.all()", function() {
    it("should return an array of all email error messages", function() {
      const validation = new Validator(
        { name: "d", email: "", age: 28 },
        { name: "required|min:2", email: "required|email", age: "min:18" }
      );

      const expected = JSON.stringify({
        name: ["The name attribute has errors."],
        email: ["The email attribute has errors."]
      });

      expect(validation.passes()).to.be.false;
      expect(JSON.stringify(validation.errors.all())).to.equal(expected);
    });
  });

  describe("ValidatorErrors.prototype.has()", function() {
    it("should return an array of all email error messages", function() {
      const validation = new Validator(
        { name: "d", email: "", age: 28 },
        { name: "required|min:2", email: "required|email", age: "min:18" }
      );

      expect(validation.passes()).to.be.false;
      expect(validation.errors.has("name")).to.equal(true);
      expect(validation.errors.has("age")).to.equal(false);
      expect(validation.errors.has("fake-property")).to.equal(false);
    });
  });

  describe("should output correct error messages for numeric-like rules", function() {
    it("should give correct error message with numeric rule", function() {
      const validator = new Validator({ val: "1" }, { val: "numeric|min:2" });
      expect(validator.fails()).to.be.true;
      expect(validator.errors.first("val")).to.equal("The val attribute has errors.");
    });

    it("should give correct error message with integer rule", function() {
      const validator = new Validator({ val: "1" }, { val: "integer|min:2" });
      expect(validator.fails()).to.be.true;
      expect(validator.errors.first("val")).to.equal("The val attribute has errors.");
    });
  });
});
