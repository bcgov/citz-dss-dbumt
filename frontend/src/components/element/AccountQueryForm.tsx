import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';
import { InfoBox, InfoBoxField } from './InfoBox';
import { apiFetch } from '../../api/client';
import { toEnvLabel } from '../../utilities/EnvMap';

type VerifyResponse = { environment: string; pswd_expires: string | null };

interface AccountQueryFormProps {
  oracleId: string;
  verifyData?: VerifyResponse[];
  onSubmit: (payload: {
    oracleId: string;
    targetEnv: string;
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

  const isValid = !!selectedDb && (systemPrivileges || accountStatus || roles);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || isSubmitting) return;

    setIsSubmitting(true);
    onSubmit({
      oracleId,
      targetEnv: selectedDb,
      queries: { systemPrivileges, accountStatus, roles },
    });
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <InfoBox header="BCGW Oracle Account Query">
        <div className="m-2">
          <InfoBoxField
            titleText="BCGW Account/Username:"
            contentText={oracleId}
          />
        </div>

        <div className="w-md relative m-2 px-4 py-2">
          <label
            htmlFor="db-select"
            className="block pb-1 font-semibold text-black"
          >
            Select a database
          </label>
          <select
            id="db-select"
            name="database"
            value={selectedDb}
            onChange={(e) => setSelectedDb(e.target.value)}
            className="form-select w-full appearance-none rounded border border-gray-300 bg-white px-3 py-2 pr-10"
            required
            aria-describedby="db-help"
          >
            <option value="" disabled>
              -- Select --
            </option>
            {databases.map((code) => (
              <option key={code} value={code}>
                {toEnvLabel(code)}
              </option>
            ))}
          </select>
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
          <button
            type="submit"
            disabled={!isValid || isSubmitting}
            className={`rounded px-4 py-2 text-white ${
              !isValid || isSubmitting
                ? 'cursor-not-allowed bg-gray-400'
                : 'bg-blue-800 hover:bg-blue-900'
            }`}
          >
            {isSubmitting ? 'Submitting…' : 'Submit'}
          </button>
        </div>
      </InfoBox>
    </form>
  );
};
