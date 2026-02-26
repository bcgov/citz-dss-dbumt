import { InfoBox } from './InfoBox';
import { Button, InlineAlert } from '@bcgov/design-system-react-components';
import QueryResults from '../../types/QueryResults';

export const QueryResultsPanel = ({
  results,
  //  onCopySection,
  onDownloadAll,
  isDownloading,
  isQueryLoading,
  pdfError,
}: {
  results: QueryResults[];
  //  onCopySection?: (text: string) => void;
  onDownloadAll?: () => void;
  isDownloading: boolean;
  isQueryLoading: boolean;
  pdfError: string | null;
}) => {
  return (
    <div>
      {pdfError && (
        <div className="m-4">
          <InlineAlert
            variant="danger"
            title="PDF Error"
            description={pdfError}
          />
        </div>
      )}
      {results.map((r, i) => (
        <InfoBox
          key={i}
          header={r.envTitle}
          className="query-results mb-8 bg-white"
        >
          {r.systemPrivileges && (
            <div className="m-2 px-4 py-2">
              <div className="mb-2 flex items-center justify-between">
                <p className="font-semibold">System Privileges</p>
                {/* --- move copy button into header --*/}
                {/* {onCopySection && (
                  <button
                    type="button"
                    className="rounded border px-3 py-1 text-sm hover:bg-gray-100"
                    onClick={() =>
                      onCopySection(
                        r.systemPrivileges!.map((x) => `${x.grantee}\t${x.privilege}`).join('\n'),
                      )
                    }
                  >
                    Copy
                  </button>
                )} */}
              </div>
              <div className="overflow-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr>
                      <th className="border px-2 py-1 text-left">GRANTEE</th>
                      <th className="border px-2 py-1 text-left">PRIVILEGE</th>
                    </tr>
                  </thead>
                  <tbody>
                    {r.systemPrivileges.map((row, idx) => (
                      <tr key={idx}>
                        <td className="border px-2 py-1">{row.grantee}</td>
                        <td className="border px-2 py-1">{row.privilege}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {r.accountStatus && (
            <div className="m-2 px-4 py-2">
              <p className="mb-2 font-semibold">Account Status</p>
              <div className="overflow-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr>
                      <th className="border px-2 py-1 text-left">USERNAME</th>
                      <th className="border px-2 py-1 text-left">
                        ACCOUNT_STATUS
                      </th>
                      <th className="border px-2 py-1 text-left">
                        EXPIRY_DATE
                      </th>
                      <th className="border px-2 py-1 text-left">
                        DEFAULT_TABLESPACE
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {r.accountStatus.map((row, idx) => (
                      <tr key={idx}>
                        <td className="border px-2 py-1">{row.username}</td>
                        <td className="border px-2 py-1">
                          {row.account_status}
                        </td>
                        <td className="border px-2 py-1">{row.expiry_date}</td>
                        <td className="border px-2 py-1">
                          {row.default_tablespace}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {r.roles && (
            <div className="m-2 px-4 py-2">
              <p className="mb-2 font-semibold">Roles</p>
              <div className="overflow-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr>
                      <th className="border px-2 py-1 text-left">GRANTEE</th>
                      <th className="border px-2 py-1 text-left">
                        GRANTED_ROLE
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {r.roles.map((row, idx) => (
                      <tr key={idx}>
                        <td className="border px-2 py-1">{row.grantee}</td>
                        <td className="border px-2 py-1">{row.granted_role}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </InfoBox>
      ))}

      <div className="mt-4 flex gap-3">
        <Button
          variant="primary"
          size="medium"
          type="button"
          onClick={onDownloadAll}
          isDisabled={isDownloading || results.length === 0}
        >
          {isDownloading ? 'Generating PDF...' : 'Download Results'}
        </Button>
      </div>
    </div>
  );
};
