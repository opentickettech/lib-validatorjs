import {
  describe,
  it,
  expect,
} from 'vitest';

const { Validator } = require("./setup.cjs");

describe("sometimes validation pass rules", function() {
  it("should pass when the property is passed with data", function() {
    const validator = new Validator(
      { firstname: "Johnny", lastname: "Appleseed" },
      { firstname: "required", lastname: "required|sometimes" }
    );
    expect(validator.passes()).to.be.true;
  });

  it("should pass when the property is not passed with data", function() {
    const validator = new Validator({ firstname: "Johnny" }, { firstname: "required", lastname: "required|sometimes" });
    expect(validator.passes()).to.be.true;
  });

  it("should be able to register and pass async rule when the property is passed with data", () => new Promise(done => {
    Validator.registerAsync(
      "username",
      function(desiredUsername, ruleValue, attribute, passes) {
        setTimeout(function() {
          if (desiredUsername == "test") {
            passes();
          }
        }, 50);
      },
      ":attribute is an invalid username"
    );

    const validator = new Validator(
      { username: "test", email: "test@example.com" },
      { username: "username", email: "email|sometimes" }
    );
    validator.passes(done);
  }));

  it("should be able to register and pass async rule when the property is not passed with data", () => new Promise(done => {
    Validator.registerAsync(
      "username",
      function(desiredUsername, ruleValue, attribute, passes) {
        setTimeout(function() {
          if (desiredUsername == "test") {
            passes();
          }
        }, 50);
      },
      ":attribute is an invalid username"
    );

    const validator = new Validator({ username: "test" }, { username: "username", email: "email|sometimes" });
    validator.passes(done);
  }));
});
