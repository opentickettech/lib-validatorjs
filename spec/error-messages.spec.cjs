import {
  describe,
  it,
  expect,
} from 'vitest';

const { Validator } = require("./setup.cjs");

describe("Error messages", function() {
  describe("first()", function() {
    it("should return an error message that states the email is required", function() {
      const validator = new Validator({ email: "" }, { email: "required|email" });
      expect(validator.passes()).to.be.false;
      expect(validator.errors.first("email").message).to.equal("validation.required");
    });

    it("should have a method on the errors object to retrieve the first error message for an attribute", function() {
      const validator = new Validator({ email: "" }, { email: "required|email" });
      expect(validator.passes()).to.be.false;
      expect(validator.errors.first("email").message).to.equal("validation.required");
    });

    it("should return false if errors.first() is called and there are no errors", function() {
      const validator = new Validator({ email: "john@yahoo.com" }, { email: "required|email" });
      expect(validator.passes()).to.be.true;
      expect(validator.errors.first("email")).to.equal(false);
    });

    it("should return an error message that states the email must be valid", function() {
      const validator = new Validator({ email: "john@yahoo" }, { email: "required|email" });
      expect(validator.passes()).to.be.false;
      expect(validator.errors.first("email").message).to.equal("validation.email");
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
      expect(validator.errors.first("age").message).to.equal("validation.min.numeric"); // min numeric
      expect(validator.errors.first("description").message).to.equal("validation.min.string"); // min string
      expect(validator.errors.first("info").message).to.equal("validation.required");
      expect(validator.errors.first("hours").message).to.equal("validation.size.numeric"); // size numeric
      expect(validator.errors.first("pin").message).to.equal("validation.size.string"); // size string
      expect(validator.errors.first("range").message).to.equal("validation.max.numeric"); // max numeric
      expect(validator.errors.first("tweet").message).to.equal("validation.max.string"); // max string
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
      expect(validator.errors.first("name").message).to.equal("validation.alpha");
    });

    it("should fail with non alpha dash characters", function() {
      const validator = new Validator({ name: "David *" }, { name: "alpha_dash" });
      expect(validator.passes()).to.be.false;
      expect(validator.errors.first("name").message).to.equal(
        "validation.alpha_dash"
      );
    });

    it("should fail without a matching confirmation field for the field under validation", function() {
      const validator = new Validator({ password: "abc" }, { password: "confirmed" });
      expect(validator.passes()).to.be.false;
      expect(validator.errors.first("password").message).to.equal("validation.confirmed");
    });

    it("should fail when the 2 attributes are the same", function() {
      const validator = new Validator({ field1: "abc", field2: "abc" }, { field2: "different:field1" });
      expect(validator.passes()).to.be.false;
      expect(validator.errors.first("field2").message).to.equal("validation.different");
    });

    it("should fail with a url only containing http://", function() {
      const link = "http://";
      const validator = new Validator({ link: link }, { link: "url" });
      expect(validator.passes()).to.be.false;
      expect(validator.errors.first("link").message).to.equal("validation.url");
    });

    it("should fail the custom telephone rule registration with a default error message", function() {
      Validator.register("telephone", function(val) {
        return val.match(/^\d{3}-\d{3}-\d{4}$/);
      });

      const validator = new Validator({ phone: "4213-454-9988" }, { phone: "telephone" });
      expect(validator.passes()).to.be.false;
      expect(validator.errors.first("phone").message).to.equal("validation.def");
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
      expect(validator.errors.first("cell").message).to.equal("The cell phone number is not in the format XXX-XXX-XXXX.");
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
      expect(validator.errors.get("email").length).to.equal(2);
    });
  });

  describe("ValidatorErrors.prototype.all()", function() {
    it("should return an array of all email error messages", function() {
      const validation = new Validator(
        { name: "d", email: "", age: 28 },
        { name: "required|min:2", email: "required|email", age: "min:18" }
      );

      expect(validation.passes()).to.be.false;
      expect(validation.errors.first("name").message).to.equal("validation.min.string");
      expect(validation.errors.first("email").message).to.equal("validation.required");
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
      expect(validator.errors.first("val").message).to.equal("validation.min.numeric");
    });

    it("should give correct error message with integer rule", function() {
      const validator = new Validator({ val: "1" }, { val: "integer|min:2" });
      expect(validator.fails()).to.be.true;
      expect(validator.errors.first("val").message).to.equal("validation.min.numeric");
    });
  });
});
