import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEye,
  faEyeSlash,
  faAngleDown,
  faExclamationCircle,
} from '@fortawesome/free-solid-svg-icons';
import { InfoBox, InfoBoxField } from './InfoBox';
import SuccessMessage from './SuccessMessage';
import ErrorMessage from './ErrorMessage';
import { apiFetch } from '../../api/client';
import { Button } from '@bcgov/design-system-react-components';
import { SwitchAccountLink } from './SwitchAccountLink';
import { DbSelect } from './DbSelect';
import VerifyResponse from '../../types/VerifyResponse';

interface ChangePasswordFormProps {
  oracleId: string;
  verifyData?: VerifyResponse[];
}

interface ErrorMessageType {
  basic: string;
  details?: string;
}

const fetchUserEnvironments = async (oracleId: string): Promise<string[]> => {
  try {
    const data = (await apiFetch('/verifyAccount/verify', {
      method: 'POST',
      body: JSON.stringify({ username: oracleId }),
    })) as VerifyResponse[];

    return data.map((item: VerifyResponse) => item.environment);
  } catch (err) {
    console.error('Failed to fetch environments:', err);
    return [];
  }
};

const validatePassword = (pw: string) => {
  return {
    length: pw.length >= 10 && pw.length <= 14,
    upper: /[A-Z]/.test(pw),
    lower: /[a-z]/.test(pw),
    digit: /\d/.test(pw),
    noSpecial: /^[A-Za-z0-9]*$/.test(pw),
    noLeadingDigit: !/^\d/.test(pw),
  };
};

export const ChangePasswordForm = ({
  oracleId: _oracleId,
  verifyData,
}: ChangePasswordFormProps) => {
  const [databases, setDatabases] = useState<string[]>([]);
  const [selectedDb, setSelectedDb] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [capsLockOn, setCapsLockOn] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<ErrorMessageType | null>(
    null,
  );

  useEffect(() => {
    if (!_oracleId) return;

    // Use data passed from Home when available; otherwise fetch
    if (verifyData?.length) {
      const envs: string[] = verifyData.map((v) => v.environment);
      setDatabases(envs);
      if (envs.length === 1) setSelectedDb(envs[0]);
      return;
    }

    fetchUserEnvironments(_oracleId).then((envs: string[]) => {
      setDatabases(envs);
      if (envs.length === 1) setSelectedDb(envs[0]);
    });
  }, [_oracleId, verifyData]);

  useEffect(() => {
    //Clear text boxes when user changes database selection
    setCurrentPassword('');
    setNewPassword('');
    setSuccessMessage(null);
    setErrorMessage(null);
  }, [selectedDb]);

  const passwordValidation = validatePassword(newPassword);
  const isValid =
    Object.values(passwordValidation).every(Boolean) &&
    currentPassword.length > 0 &&
    selectedDb.length > 0 &&
    databases.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    const backendEnv = selectedDb;

    try {
      await apiFetch('/changePassword', {
        method: 'POST',
        body: JSON.stringify({
          oracleId: _oracleId.trim(),
          currentPassword,
          newPassword,
          targetEnv: backendEnv,
        }),
      });

      setErrorMessage(null);
      setSuccessMessage(
        `Your BCGW ${selectedDb} database password was successfully changed.`,
      );
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setSuccessMessage(null);
      setErrorMessage({ basic: 'Password change failed.', details: message });
    }
  };

  useEffect(() => {
    const handleKeyEvent = (e: KeyboardEvent) => {
      setCapsLockOn(e.getModifierState && e.getModifierState('CapsLock'));
    };

    window.addEventListener('keydown', handleKeyEvent);
    window.addEventListener('keyup', handleKeyEvent);

    return () => {
      window.removeEventListener('keydown', handleKeyEvent);
      window.removeEventListener('keyup', handleKeyEvent);
    };
  }, []);

  return (
    <form onSubmit={handleSubmit}>
      <InfoBox header="BCGW Oracle Account Change Password">
        {successMessage && <SuccessMessage>{successMessage}</SuccessMessage>}

        {/* {errorMessage && (
          <SuccessMessage type="error">
            {errorMessage }
          </SuccessMessage>
        )} */}

        {errorMessage && (
          <ErrorMessage
            basic={errorMessage.basic}
            details={errorMessage.details}
          />
        )}

        <div className="m-2 flex">
          <InfoBoxField
            titleText="BCGW Account/Username:"
            contentText={_oracleId}
          />
          <SwitchAccountLink />
        </div>

        <div className="w-md relative m-2 px-4 py-2">
          <label
            htmlFor="db-select"
            className="block pb-1 font-semibold text-black"
          >
            Select a Database
          </label>
          <DbSelect
            value={selectedDb}
            onChange={setSelectedDb}
            databases={databases}
            showSelectAll={false}
          />

          {/* fake dropdown icon */}
          <div className="right-7.5 pointer-events-none absolute top-[47px] text-gray-600">
            <FontAwesomeIcon icon={faAngleDown} className="h-5 w-5" />
          </div>
        </div>

        {/* current password */}
        <div className="w-md ml-2 mt-2 px-4 pt-2">
          <label
            htmlFor="current-pw"
            className="block pb-1 font-semibold text-black"
          >
            Current Password
          </label>
          <div className="relative">
            <input
              id="current-pw"
              type={showCurrent ? 'text' : 'password'}
              name="currentPassword"
              autoComplete="current-password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="bg-white-blue hide-edge-reveal w-full rounded border border-gray-300 px-3 py-2 pr-10"
            />
            {/* eye icon */}
            <button
              type="button"
              aria-label={showCurrent ? 'Hide password' : 'Show password'}
              aria-pressed={showCurrent}
              onClick={() => setShowCurrent(!showCurrent)}
              className="absolute right-4 top-2.5 text-gray-600"
            >
              <FontAwesomeIcon icon={showCurrent ? faEye : faEyeSlash} />
            </button>
          </div>
        </div>
        <div
          className="mb-2 ml-2 px-4 text-sm leading-6"
          style={{ color: 'var(--color-neutral-password)' }}
        >
          Forgot your password? Please contact&nbsp;
          <a
            className="breadcrumb-link"
            target="_blank"
            href="https://bcgov.github.io/data-publication/pages/faq.html#how-do-i-changereset-my-bcgw-password"
          >
            NRM Service Desk
          </a>
          .
        </div>
        {/* new password */}
        <div className="w-md m-2 px-4 py-2">
          <label
            htmlFor="new-pw"
            className="block pb-1 font-semibold text-black"
          >
            New Password
          </label>
          <div className="relative">
            <input
              id="new-pw"
              type={showNew ? 'text' : 'password'}
              name="newPassword"
              autoComplete="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="bg-white-blue hide-edge-reveal w-full rounded border border-gray-300 px-3 py-2 pr-10"
            />
            {/* eye icon */}
            <button
              type="button"
              aria-label={showNew ? 'Hide password' : 'Show password'}
              aria-pressed={showNew}
              onClick={() => setShowNew(!showNew)}
              className="absolute right-4 top-2.5 text-gray-600"
            >
              <FontAwesomeIcon icon={showNew ? faEye : faEyeSlash} />
            </button>
          </div>
        </div>

        {/* Password Rules */}
        <div className="m-2 px-4 text-sm leading-6">
          <ul className="space-y-1">
            <li>
              {capsLockOn && (
                <div className="mt-2 flex items-center text-sm font-semibold text-black">
                  <FontAwesomeIcon
                    icon={faExclamationCircle}
                    className="mr-2"
                  />
                  Caps Lock is on!
                </div>
              )}
            </li>
            <li
              style={{
                color:
                  newPassword.length === 0
                    ? 'var(--color-neutral-password)' // neutral
                    : passwordValidation.length
                      ? 'var(--color-valid-password)' // valid
                      : 'var(--color-invalid-password)', // invalid
              }}
            >
              {newPassword.length === 0
                ? '•'
                : passwordValidation.length
                  ? '✓'
                  : 'X'}{' '}
              Password must be between 10–14 characters
            </li>

            <li
              style={{
                color: passwordValidation.upper
                  ? 'var(--color-valid-password)'
                  : 'var(--color-neutral-password)',
              }}
            >
              {passwordValidation.upper ? '✓' : '•'} One uppercase alphabet
              letter (A…Z)
            </li>

            <li
              style={{
                color: passwordValidation.lower
                  ? 'var(--color-valid-password)'
                  : 'var(--color-neutral-password)',
              }}
            >
              {passwordValidation.lower ? '✓' : '•'} One lowercase alphabet
              letter (a…z)
            </li>

            <li
              style={{
                color: passwordValidation.digit
                  ? 'var(--color-valid-password)'
                  : 'var(--color-neutral-password)',
              }}
            >
              {passwordValidation.digit ? '✓' : '•'} One number (0–9)
            </li>

            <li
              style={{
                color:
                  newPassword.length === 0
                    ? 'var(--color-neutral-password)'
                    : passwordValidation.noSpecial
                      ? 'var(--color-valid-password)'
                      : 'var(--color-invalid-password)',
              }}
            >
              {passwordValidation.noSpecial
                ? newPassword.length > 0
                  ? '✓'
                  : '•'
                : 'X'}{' '}
              No special character (e.g. ! $ & ~, etc)
            </li>

            <li
              style={{
                color:
                  newPassword.length === 0
                    ? 'var(--color-neutral-password)'
                    : passwordValidation.noLeadingDigit
                      ? 'var(--color-valid-password)'
                      : 'var(--color-invalid-password)',
              }}
            >
              {passwordValidation.noLeadingDigit
                ? newPassword.length > 0
                  ? '✓'
                  : '•'
                : 'X'}{' '}
              No number as the first character
            </li>
            {/* TODO
              <li style={{ color: 'var(--color-neutral-password)' }}>
                • No historical password (not implemented)
              </li>
              */}
          </ul>
        </div>

        {/* buttons */}
        <div className="m-2 flex items-center justify-between px-4 pt-4">
          <Button
            variant="primary"
            size="medium"
            type="submit"
            isDisabled={!isValid}
          >
            Change Password
          </Button>
          <Button
            variant="secondary"
            size="medium"
            type="button"
            onClick={() => {
              setCurrentPassword('');
              setNewPassword('');
              setSelectedDb('');
            }}
          >
            Clear Form
          </Button>
        </div>
      </InfoBox>
    </form>
  );
};
