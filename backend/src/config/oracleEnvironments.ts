// configuration for a specific oracle environment
export interface EnvironmentConfig {
  name: string;
  connectString: string;
  user: string;
  password: string;
}

export const ENVIRONMENTS: EnvironmentConfig[] = [
  {
    name: "DEV",
    connectString: process.env.BCGW_DEV_STRING,
    user: process.env.DEV_USER,
    password: process.env.DEV_PASSWORD,
  },
  {
    name: "TEST",
    connectString: process.env.BCGW_TEST_STRING,
    user: process.env.TEST_USER,
    password: process.env.TEST_PASSWORD,
  },
  {
    name: "PROD",
    connectString: process.env.BCGW_PROD_STRING,
    user: process.env.PROD_USER,
    password: process.env.PROD_PASSWORD,
  },
].filter(
  (env): env is EnvironmentConfig =>
    typeof env.connectString === "string" &&
    typeof env.user === "string" &&
    typeof env.password === "string",
);

/**
 * @summary Retrieve a filtered list of Oracle environments by name
 *
 * @param names - Array of environment names to include (e.g., ["DEV", "TEST"])
 * @returns A filtered list of environment configurations matching the provided names
 */
export const getEnvironmentsByName = (names: string[]): EnvironmentConfig[] => {
  try {
    const nameSet = new Set(names.map((name) => name.toUpperCase()));
    return ENVIRONMENTS.filter((env) => nameSet.has(env.name.toUpperCase()));
  } catch (error) {
    console.error("Error retrieving environments by name:", error);
    return [];
  }
};

/**
 * @summary Retrieve an Oracle environment by name
 *
 * @param name - Environment name to retrieve (e.g., "DEV")
 * @returns Environment configuration matching the provided name
 */
export const getEnvironmentByName = (
  name: string,
): EnvironmentConfig | null => {
  return (
    ENVIRONMENTS.find((env) => name.toUpperCase() === env.name.toUpperCase()) ||
    null
  );
};
