import {
  describe,
  it,
  expect,
} from 'vitest';

const { Validator } = require("./setup.cjs");

describe("Validator", function() {
  it("should correctly flatten nested object", function() {
    const asserts = [
      [undefined, {}],
      [null, {}],
      [{}, {}],
      [{ foo: null }, { foo: null }],
      [{ foo: {} }, { foo: {} }],
      [{ foo: 1 }, { foo: 1 }],
      [{ foo: [] }, { foo: [] }],
      [{ foo: { bar: 1 } }, { "foo.bar": 1 }],
      [{ foo: { bar: [] } }, { "foo.bar": [] }],
      [{ foo: { bar: { fizz: "buzz" } } }, { "foo.bar.fizz": "buzz" }],
      [{ foo: { bar: { fizz: ["buzz"] } } }, { "foo.bar.fizz": ["buzz"] }]
    ];
    const validator = new Validator({}, {});

    asserts.forEach(function(assert) {
      expect(validator._flattenObject(assert[0])).to.be.eql(assert[1]);
    });
  });
}); // Page constructor
