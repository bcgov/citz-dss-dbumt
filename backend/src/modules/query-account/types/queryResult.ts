export type DataRow = Record<string, string>;

export type QueryType = "accountStatus" | "roles" | "systemPrivileges";
export type QueriesResult = {
  environment: string;
  queryResult: QueryResult[];
};

export type QueryResult = {
  query: QueryType;
  data: DataRow[];
};
