import {
  describe,
  it,
  expect,
} from 'vitest';

const { Validator } = require("./setup.cjs");

describe("Wildcard", function() {
  describe("Simple Rules ", function() {
    it("should have validation a deep level fails", function() {
      const validator = new Validator(
        {
          foo: [
            {
              bar: [
                {
                  people: [
                    {
                      name: "",
                      age: "aa",
                      term: false,
                      isActive: "not"
                    },
                    {
                      name: "",
                      age: "aa",
                      term: false,
                      isActive: "not"
                    }
                  ]
                },
                {
                  people: [
                    {
                      name: "",
                      age: "aa",
                      term: false,
                      isActive: "not"
                    },
                    {
                      name: "",
                      age: "aa",
                      term: false,
                      isActive: "not"
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          "foo.*.bar.*.people.*.name": "required",
          "foo.*.bar.*.people.*.age": "numeric",
          "foo.*.bar.*.people.*.term": "accepted",
          "foo.*.bar.*.people.*.isActive": "boolean"
        }
      );
      expect(validator.fails()).to.be.true;
      expect(validator.passes()).to.be.false;
    });
    it("should have validation a deep level passes", function() {
      const validator = new Validator(
        {
          foo: [
            {
              bar: [
                {
                  people: [
                    {
                      name: "Test",
                      age: "100",
                      term: true,
                      isActive: "0"
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          "foo.*.bar.*.people.*.name": "required",
          "foo.*.bar.*.people.*.age": "numeric",
          "foo.*.bar.*.people.*.term": "accepted",
          "foo.*.bar.*.people.*.isActive": "boolean"
        }
      );
      expect(validator.fails()).to.be.false;
      expect(validator.passes()).to.be.true;
    });
  });
  describe("Rules with dependent of another field", function() {
    it("should have validation fail with required_* and show customMessage", function() {
      const validator = new Validator(
        {
          users: [
            {
              name: "Teste",
              lastName: "",
              age: "",
              requiredAge: "true"
            }
          ]
        },
        {
          "users.*.age": "required_if:users.*.requiredAge,true",
          "users.*.lastName": "required_with:users.*.name"
        },
        {
          "required_if.users.*.age": "Required"
        }
      );
      expect(validator.fails()).to.be.true;
      expect(validator.passes()).to.be.false;
      expect(validator.errors.first("users.0.age").message).to.equal("Required");
      expect(validator.errors.first("users.0.lastName").message).to.equal("validation.required_with");
    });
  });
});
