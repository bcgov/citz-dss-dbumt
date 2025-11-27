import { useEffect, useState, useRef } from 'react';
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
import { apiFetch } from '../api/client';
import ErrorMessage from '../components/element/ErrorMessage';
import { useUser } from '../contexts/UserContext';
import VerifyResponse from '../types/VerifyResponse';

type QueryRequest = {
  oracleId: string;
  targetEnv: string;
  queries: {
    systemPrivileges: boolean;
    accountStatus: boolean;
    roles: boolean;
  };
};

type DataRow = Record<string, string>;
type QueryResult = {
  query: 'accountStatus' | 'roles' | 'systemPrivileges';
  data: DataRow[];
};
type EnvResult = {
  environment: string;
  queryResult: QueryResult[];
};

// Normalize uppercase Oracle columns to lowercase keys
const lowerKeys = (row: Record<string, string>) =>
  Object.fromEntries(Object.entries(row).map(([k, v]) => [k.toLowerCase(), v]));

// Map the result array into <QueryResultsPanel /> props
const mapDataToPanel = (envResults: EnvResult[]): QueryResults[] => {
  if (!Array.isArray(envResults) || envResults.length === 0) return [];

  return envResults.map((envRes) => {
    const envLabel = toEnvLabel(envRes.environment);
    const entry: QueryResults = {
      envTitle: `BCGW ${envLabel} Database`,
    };

    for (const qr of envRes.queryResult ?? []) {
      const rows = (qr.data ?? []).map(lowerKeys);

      switch (qr.query) {
        case 'systemPrivileges':
          entry.systemPrivileges = rows.map((r) => ({
            grantee: r.grantee,
            privilege: r.privilege,
          }));
          break;

        case 'roles':
          entry.roles = rows.map((r) => ({
            grantee: r.grantee,
            granted_role: r.granted_role,
          }));
          break;

        case 'accountStatus':
          entry.accountStatus = rows.map((r) => ({
            username: r.username,
            account_status: r.account_status,
            // EXPIRY_DATE is already aliased in SQL; after lowerKeys it's 'expiry_date'
            expiry_date: r.expiry_date ?? null,
            default_tablespace: r.default_tablespace,
          }));
          break;

        default:
          // Ignore unknown query names
          break;
      }
    }

    return entry;
  });
};

export const AccountQuery = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Used to get oracleId from context
  const { oracleId } = useUser();

  const verifyData = (location.state ?? {}) as VerifyResponse[];

  useEffect(() => {
    if (!oracleId) navigate('/login', { replace: true });
  }, [oracleId, navigate]);

  const [results, setResults] = useState<QueryResults[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  if (!oracleId) return null;

  const handleRunQuery = async (req: QueryRequest) => {
    // Cancel any dangling request
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);

    const queries = (
      Object.entries(req.queries) as [keyof QueryRequest['queries'], boolean][]
    )
      .filter(([, on]) => on)
      .map(([k]) => k) as ('accountStatus' | 'roles' | 'systemPrivileges')[];

    if (queries.length === 0) {
      setResults([]);
      setLoading(false);
      return;
    }

    const body = {
      username: req.oracleId.toUpperCase(),
      envs: [req.targetEnv],
      queries,
    };

    try {
      const res = await apiFetch('/queryAccount/query', {
        method: 'POST',
        body: JSON.stringify(body),
        signal: controller.signal,
      });

      const mappedData = mapDataToPanel(res);
      setResults(mappedData);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred while querying account.');
      }
      setResults(null);
      return;
    } finally {
      setLoading(false);
    }
  };

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
        isLoading={loading}
      />
      {error && (
        <>
          <br />

          <ErrorMessage basic={error} />
        </>
      )}
      {results && (
        <>
          <br />
          <div id="query-results">
            <QueryResultsPanel
              results={results}
              /*onCopySection={(text) => navigator.clipboard.writeText(text)}
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
              }}*/
            />
          </div>
        </>
      )}
    </BaseLayout>
  );
};
