/**
 * A map for provider information
 *
 * @interface Providers
 */
export interface Providers {
  [name: string]: Provider;
}

/**
 * Single provider interface.
 * Used to store pre-constructed query templates for various currency rate providers.
 * @export
 * @interface Provider
 */
export interface Provider {
  keyNeeded: boolean;
  key: any;
  endpoint: { base: string; single: string; multiple: string };
  handler: Function;
}

/**
 * A function that constructs provider based on raw input data.
 *
 * @export
 * @param {*} provider object containing provider name and api key
 * @returns {Provider} constructed provider
 */
export function resolveProvider(provider: any): Provider {
  let p = providers[provider.name];
  if (!p) {
    throw "No provider with this name. Please use a provider from the supported providers list.";
  }

  // attaching key
  p.key = provider.key;
  return p;
}

/**
 * Provider map initialization
 */
export const providers: Providers = {
  ExchangeRatesAPI: {
    endpoint: {
      base: "https://api.exchangeratesapi.io/latest",
      single: "?base=%FROM%&symbols=%TO%",
      multiple: "?base=%FROM%"
    },
    keyNeeded: false,
    key: null,
    handler: function(data) {
      return data.rates;
    }
  },
  CurrencyLayer: {
    endpoint: {
      base: "https://apilayer.net/api/live?access_key=%KEY%",
      single: "&source=%FROM%",
      multiple: "&source=%FROM%&currencies=%TO%"
    },
    keyNeeded: true,
    key: undefined,
    handler: function(data) {
      let map = {};
      Object.keys(data.quotes).map(key => {
        map[key.slice(3)] = data.quotes[key];
      });
      return map;
    }
  },
  OpenExchangeRates: {
    endpoint: {
      base: "https://openexchangerates.org/api/latest.json?app_id=%KEY%",
      single: "&base=%FROM%",
      multiple: "&base=%FROM%"
    },
    keyNeeded: true,
    key: undefined,
    handler: function(data) {
      return data.rates;
    }
  },
  Fixer: {
    endpoint: {
      base: "https://data.fixer.io/api/latest?access_key=%KEY%",
      single: "&base=%FROM%&symbols=%TO%",
      multiple: "&base=%FROM%"
    },
    keyNeeded: true,
    key: undefined,
    handler: function(data) {
      return data.rates;
    }
  }
};
