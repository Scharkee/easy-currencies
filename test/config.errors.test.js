const { providers, Converter } = require("../dist");

test("Provider error operations: Adding duplicate provider.", async () => {
  // default initialization
  const converter = new Converter("CurrencyLayer", "key");

  // removing default fallback provider
  converter.remove(converter.active[1]);

  const newProvider = {
    endpoint: {
      base: "base",
      single: "single",
      multiple: "multiple"
    },
    key: null,
    handler: function (data) {
      return data.rates;
    },
    errors: { 400: "Malformed query." },
    errorHandler: function (data) {
      return data.status;
    }
  };

  let error = false;

  try {
    converter.add("CurrencyLayer", newProvider, true);
  } catch (e) {
    error = true;
  }
  expect(error).toBeTruthy();
});

test("Provider error operations: Adding non provider.", async () => {
  // default initialization
  const converter = new Converter("CurrencyLayer", "key");

  // removing default fallback provider
  converter.remove(converter.active[1]);

  const newProvider = {
    errors: { 400: "Malformed query." }
  };

  let error = false;

  try {
    converter.add("P", newProvider, true);
  } catch (e) {
    error = true;
  }
  expect(error).toBeTruthy();
});
