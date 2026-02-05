import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';
import { InfoBox, InfoBoxField } from './InfoBox';
import { apiFetch } from '../../api/client';
import { Button } from '@bcgov/design-system-react-components';
import { SwitchAccountLink } from './SwitchAccountLink';
import { DbSelect } from './DbSelect';

type VerifyResponse = { environment: string; pswd_expires: string | null };

interface AccountQueryFormProps {
  oracleId: string;
  verifyData?: VerifyResponse[];
  isLoading?: boolean;
  onSubmit: (payload: {
    oracleId: string;
    targetEnvs: string[];
    queries: {
      systemPrivileges: boolean;
      accountStatus: boolean;
      roles: boolean;
    };
  }) => void;
}

const fetchUserEnvironments = async (oracleId: string): Promise<string[]> => {
  const data = (await apiFetch('/verifyAccount/verify', {
    method: 'POST',
    body: JSON.stringify({ username: oracleId }),
  })) as VerifyResponse[];
  return data.map((d) => d.environment);
};

export const AccountQueryForm = ({
  oracleId,
  verifyData,
  isLoading,
  onSubmit,
}: AccountQueryFormProps) => {
  const [databases, setDatabases] = useState<string[]>([]);
  const [selectedDb, setSelectedDb] = useState('');

  const [systemPrivileges, setSystemPrivileges] = useState(true);
  const [accountStatus, setAccountStatus] = useState(true);
  const [roles, setRoles] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!oracleId) return;

    if (verifyData?.length) {
      const envs = verifyData.map((v) => v.environment);
      setDatabases(envs);
      if (envs.length === 1) setSelectedDb(envs[0]);
      return;
    }

    fetchUserEnvironments(oracleId).then((envs) => {
      setDatabases(envs);
      if (envs.length === 1) setSelectedDb(envs[0]);
    });
  }, [oracleId, verifyData]);

  const ALL = '__ALL__';
  //If ALL is selected, return all envs, else return the selected one in an array
  function resolveSelectedEnvs(selected: string, envs: string[]): string[] {
    if (!selected) return [];
    return selected === ALL ? envs : [selected];
  }

  const isValid = !!selectedDb && (systemPrivileges || accountStatus || roles);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const targetEnvs = resolveSelectedEnvs(selectedDb, databases);

      await Promise.resolve(
        onSubmit({
          oracleId,
          targetEnvs, // ✅ always a real list
          queries: { systemPrivileges, accountStatus, roles },
        }),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <InfoBox header="BCGW Oracle Account Query">
        <div className="m-2 flex">
          <InfoBoxField
            titleText="BCGW Account/Username:"
            contentText={oracleId}
          />
          <SwitchAccountLink />
        </div>

        <div className="w-md relative m-2 px-4 py-2">
          <label
            htmlFor="db-select"
            className="block pb-1 font-semibold text-black"
          >
            Select a database
          </label>
          <DbSelect
            value={selectedDb}
            onChange={setSelectedDb}
            databases={databases}
            showSelectAll
            selectAllValue={ALL}
            selectAllLabel="All databases"
          />
          <div id="db-help" className="sr-only">
            Choose the BCGW environment to query.
          </div>
          <div
            className="right-7.5 pointer-events-none absolute top-[47px] text-gray-600"
            aria-hidden="true"
          >
            <FontAwesomeIcon icon={faAngleDown} className="h-5 w-5" />
          </div>
        </div>

        <div className="w-md m-2 px-4 py-2">
          <p className="pb-2 font-semibold text-black">Queries</p>
          <label className="mb-2 flex items-center gap-2">
            <input
              type="checkbox"
              checked={systemPrivileges}
              onChange={(e) => setSystemPrivileges(e.target.checked)}
            />
            <span>System Privileges</span>
          </label>
          <label className="mb-2 flex items-center gap-2">
            <input
              type="checkbox"
              checked={accountStatus}
              onChange={(e) => setAccountStatus(e.target.checked)}
            />
            <span>Account Status</span>
          </label>
          <label className="mb-2 flex items-center gap-2">
            <input
              type="checkbox"
              checked={roles}
              onChange={(e) => setRoles(e.target.checked)}
            />
            <span>Roles</span>
          </label>
        </div>

        <div className="m-2 px-4 py-2">
          <Button
            variant="primary"
            size="medium"
            type="submit"
            isDisabled={!isValid || isSubmitting || isLoading}
          >
            {isSubmitting ? 'Submitting…' : 'Submit'}
          </Button>
        </div>
      </InfoBox>
    </form>
  );
};
