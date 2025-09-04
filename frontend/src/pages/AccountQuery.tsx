import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { BaseLayout } from '../components/layout/BaseLayout';
import { PageTitleInfo } from '../components/layout/PageTitleInfo';
import { BreadcrumbItem } from '../components/element/Breadcrumb';
import { Text as BCGovText } from '@bcgov/design-system-react-components';
import { AccountQueryForm } from '../components/element/AccountQueryForm';
import {
  QueryResultsPanel,
  QueryResults,
} from '../components/element/QueryResultsPanel';
import { toEnvLabel } from '../utilities/EnvMap';

type VerifyResponse = { environment: string; pswd_expires: string | null };
type NavState = { oracleId?: string; verifyData?: VerifyResponse[] };

type QueryRequest = {
  oracleId: string;
  targetEnv: string;
  queries: {
    systemPrivileges: boolean;
    accountStatus: boolean;
    roles: boolean;
  };
};

export const AccountQuery = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { oracleId, verifyData } = (location.state ?? {}) as NavState;

  useEffect(() => {
    if (!oracleId) navigate('/login', { replace: true });
  }, [oracleId, navigate]);

  const [results, setResults] = useState<QueryResults[] | null>(null);

  // ---- dummy data connect to API later ----
  const buildDummyResults = (req: QueryRequest): QueryResults[] => {
    const label = toEnvLabel(req.targetEnv);
    const upper = req.oracleId.toUpperCase();

    return [
      {
        envTitle: `BCGW ${label} Database`,
        systemPrivileges: req.queries.systemPrivileges
          ? [{ grantee: upper, privilege: 'CREATE SESSION' }]
          : undefined,
        accountStatus: req.queries.accountStatus
          ? [
              {
                username: upper,
                account_status: 'OPEN',
                expiry_date: 'ADMIN or SERVICE_ID',
                default_tablespace: 'USERS',
              },
            ]
          : undefined,
        roles: req.queries.roles
          ? [{ grantee: upper, granted_role: 'SRM_WHSE_ALL_GOV' }]
          : undefined,
      },
    ];
  };

  const handleRunQuery = (req: QueryRequest) => {
    const data = buildDummyResults(req);
    setResults(data);
  };

  if (!oracleId) return null;

  const title = 'BCGW Oracle account query';
  const text = (
    <BCGovText>
      The BCGW Oracle account query tool is designed to help users track
      database accounts. It provides a way to query multiple accounts across all
      ministry databases.
    </BCGovText>
  );

  const breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Home', path: '/' },
    { label: 'Account Query' },
  ];

  return (
    <BaseLayout breadcrumbItems={breadcrumbItems}>
      <PageTitleInfo title={title} text={text} />
      <br />
      <AccountQueryForm
        oracleId={oracleId}
        verifyData={verifyData}
        onSubmit={handleRunQuery}
      />
      {results && (
        <>
          <br />
          <div id="query-results">
            <QueryResultsPanel
              results={results}
              onCopySection={(text) => navigator.clipboard.writeText(text)}
              onDownloadAll={() => {
                const blob = new Blob([JSON.stringify(results, null, 2)], {
                  type: 'application/json',
                });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'bcgw-query-results.json';
                a.click();
                URL.revokeObjectURL(url);
              }}
            />
          </div>
        </>
      )}
    </BaseLayout>
  );
};
