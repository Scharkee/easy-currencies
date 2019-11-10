import {
  Provider,
  providers,
  resolveProvider,
  UserDefinedProvider
} from "./providers";

/**
 * Interface for the format of data passed in to the module initially.
 *
 * @interface initializationConfig
 */
export interface initializationConfig {
  key: any;
  provider: string;
}

/**
 * Config object that initializes with configuration data
 * passed in by the user.
 *
 * @export
 * @class Config
 */
export class Config {
  /**
   * Array of active curency API providers.
   *
   * @type {Provider[]}
   * @memberof Config
   */
  private _active: Provider[];

  /**
   * Provider getter
   *
   * @returns {Provider[]}
   * @memberof Config
   */
  get providers(): Provider[] {
    return this._active;
  }

  /**
   * Provider setter (adder)
   *
   * @param {Provider[]} providers - providers to be added
   * @param {boolean} [setActive=false] - should the new provider(s) be prioritized
   * @returns {void}
   * @memberof Config
   */
  private addProviders(
    providers: Provider[],
    setActive: boolean = false
  ): void {
    if (setActive) {
      this._active.unshift(...providers);
      return;
    }
    this._active.push(...providers);
    return;
  }

  /**
   * Adds a single new, user-defined provider to the list of providers.
   *
   * @param {string} name - the new provider name
   * @param {Provider} provider - the new provider object
   * @param {boolean} [setActive=false] - should the new provider(s) be prioritized
   * @memberof Config
   */
  add = (
    name: string,
    provider: Provider,
    setActive: boolean = false
  ): void => {
    this.addMultiple([{ name, provider }], setActive);
  };

  /**
   * Adds multiple new, user-defined provider to the list of providers.
   *
   * @param {UserDefinedProvider[]} providers - providers to be added
   * @param {boolean} [setActive=false] - should the new provider(s) be prioritized
   * @memberof Config
   */
  addMultiple = (
    newProviders: UserDefinedProvider[],
    setActive: boolean = false
  ): void => {
    // Duplicate check
    newProviders.forEach(p => {
      if (providers[p.name]) {
        throw "A provider by this name is already registered!";
      }
      providers[p.name] = p.provider;
    });

    // Adding provider to active providers
    this.addProviders(
      newProviders.map(p => {
        return p.provider;
      }),
      setActive
    );
  };

  /**
   * Returns the current provider
   *
   * @returns {Provider} - current provider
   * @memberof Config
   */
  activeProvider(): Provider {
    return this._active[0];
  }

  /**
   * Creates an instance of Config.
   * @param {(object | undefined)} config
   * @memberof Config
   */
  constructor(...config: initializationConfig[] | undefined[] | string[]) {
    this._active = resolveProviders(...config);
  }
}

/**
 * Config resolver that normalizes configuration input into the config interface
 *
 * @export
 * @param {(object | undefined)} configuration - initial configuration
 * @returns {config} - normalized configuration object
 */
export function resolveProviders(
  ...configuration: initializationConfig[] | undefined[] | string[]
): Provider[] {
  // resolve default if none provided.
  if (typeof configuration === "undefined" || !configuration.length) {
    return [providers.ExchangeRatesAPI];
  }

  // checking for incorrect config types
  if (
    typeof configuration[0] !== "object" &&
    typeof configuration[0] !== "undefined" &&
    typeof configuration[0] !== "string"
  ) {
    throw "You must either supply nothing or a config object (see the 'config' section to see the different APIs that can be used)";
  }

  // returning single provider
  if (typeof configuration[0] === "string") {
    // constructing in initializationConfig object from string values
    return [resolveProvider({ name: configuration[0], key: configuration[1] })];
  }

  // configuration is an array of providers
  // casting
  let c = <initializationConfig[]>configuration;

  // resolving all providers
  return c.map(provider => {
    return resolveProvider(provider);
  });
}
