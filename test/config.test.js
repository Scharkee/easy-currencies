const { providers, Converter } = require("../dist");

test("Provider operations: Initializing and getting active.", async () => {
  // default initialization
  const converter = new Converter("CurrencyLayer", "key");

  const value = converter.providers;

  // expect only one active provider + the base fallback provider
  expect(value.length).toEqual(2);

  // expect given provider
  expect(value[0].endpoint.base).toBe(
    "http://apilayer.net/api/live?access_key=%KEY%"
  );
  expect(value[0].key).toBe("key");

  // second getter
  expect(converter.providers).toEqual(converter.active);
});

test("Provider operations: Initializing via ProviderReference", async () => {
  // default initialization
  const converter = new Converter({ name: "CurrencyLayer", key: "key" });

  const value = converter.providers;

  // expect only one active provider + the base fallback provider
  expect(value.length).toEqual(2);

  // expect given provider
  expect(value[0].endpoint.base).toBe(
    "http://apilayer.net/api/live?access_key=%KEY%"
  );
  expect(value[0].key).toBe("key");

  // second getter
  expect(converter.providers).toEqual(converter.active);
});

test("Provider operations: Adding provider - active.", async () => {
  // default initialization
  const converter = new Converter("CurrencyLayer", "key");

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

  converter.add("MyProvider", newProvider, true);

  const value = converter.providers;

  expect(value.length).toEqual(3);

  // expect given provider (with SetActive)
  expect(value[0]).toEqual(newProvider);

  // expect the provider to be registered in the register map
  expect(providers["MyProvider"]).toBeDefined();
  expect(providers["MyProvider"]).toEqual(newProvider);
});

test("Provider operations: Adding provider - inactive.", async () => {
  // default initialization
  const converter = new Converter("CurrencyLayer", "key");

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

  converter.add("MyProvider5", newProvider);

  const value = converter.providers;

  expect(value.length).toEqual(3);

  // expect given provider (with SetActive)
  expect(value[2]).toEqual(newProvider);

  // expect the provider to be registered in the register map
  expect(providers["MyProvider5"]).toBeDefined();
  expect(providers["MyProvider5"]).toEqual(newProvider);
});

test("Provider operations: Adding multiple providers.", async () => {
  // default initialization
  const converter = new Converter("CurrencyLayer", "key");

  const newProvider1 = {
      endpoint: {
        base: "base1",
        single: "single1",
        multiple: "multiple1"
      },
      key: null,
      handler: function (data) {
        return data.rates;
      },
      errors: { 400: "Malformed query." },
      errorHandler: function (data) {
        return data.status;
      }
    },
    newProvider2 = {
      endpoint: {
        base: "base2",
        single: "single2",
        multiple: "multiple2"
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

  converter.addMultiple([
    { name: "MyProvider1", provider: newProvider1 },
    { name: "MyProvider2", provider: newProvider2 }
  ]);

  const value = converter.providers;

  expect(value.length).toEqual(4);

  // expect given provider (with SetActive)
  expect(value[2]).toEqual(newProvider1);
  expect(value[3]).toEqual(newProvider2);

  // expect the provider to be registered in the register map
  expect(providers["MyProvider1"]).toBeDefined();
  expect(providers["MyProvider1"]).toEqual(newProvider1);
  expect(providers["MyProvider2"]).toBeDefined();
  expect(providers["MyProvider2"]).toEqual(newProvider2);
});

test("Proxy operations: Set proxy.", async () => {
  // default initialization
  const converter = new Converter("CurrencyLayer", "key");

  const expectedProxyConfiguration = {
    host: "0.0.0.0",
    port: 1,
    auth: { username: "", password: "" }
  };

  converter.setProxyConfiguration({
    host: "0.0.0.0",
    port: 1,
    auth: { username: "", password: "" }
  });

  expect(converter.config.getClient().defaults.proxy).toEqual(
    expectedProxyConfiguration
  );
});
