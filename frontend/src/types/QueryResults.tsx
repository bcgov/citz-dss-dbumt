type QueryResults = {
  envTitle: string;
  systemPrivileges?: { grantee: string; privilege: string }[];
  accountStatus?: {
    username: string;
    account_status: string;
    expiry_date: string;
    default_tablespace: string;
  }[];
  roles?: { grantee: string; granted_role: string }[];
};

export default QueryResults;
