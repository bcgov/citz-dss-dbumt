interface LogParams {
  actionType: "CHANGE_PASSWORD" | "QUERY_ACCOUNT";
  IDIR: string;
  email?: string;
  oracleID: string;
  environment: string;
  details?: object;
  status?: "SUCCESS" | "FAILURE";
  message?: string;
  createdAt?: Date;
}

export { LogParams };
