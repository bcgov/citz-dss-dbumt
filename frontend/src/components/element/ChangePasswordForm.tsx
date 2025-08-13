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

interface ChangePasswordFormProps {
  oracleId: string;
}

interface ErrorMessageType {
  basic: string;
  details?: string;
}

const fetchUserEnvironments = async (oracleId: string) => {
  try {
    const data = await apiFetch('/verifyAccount/verify', {
      method: 'POST',
      body: JSON.stringify({ username: oracleId }),
    });

    return data.map((item: { environment: string }) => item.environment);
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

    fetchUserEnvironments(_oracleId).then(setDatabases);
  }, [_oracleId]);

  const passwordValidation = validatePassword(newPassword);
  const isValid =
    Object.values(passwordValidation).every(Boolean) &&
    currentPassword.length > 0 &&
    selectedDb.length > 0;

  const envMap: Record<string, string> = {
    Development: 'DEV',
    Test: 'TEST',
    Production: 'PROD',
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    const backendEnv = envMap[selectedDb] || selectedDb;

    try {
      const data = await apiFetch('/changePassword', {
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
    } catch (err: any) {
      setSuccessMessage(null);
      setErrorMessage({
        basic: 'Password change failed.',
        details: err.reason || String(err),
      });
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

        <div className="m-2">
          <InfoBoxField
            titleText="BCGW Account/Username:"
            contentText={_oracleId}
          />
        </div>

        <div className="w-md relative m-2 px-4 py-2">
          <label className="block pb-1 font-semibold text-black">
            Select a Database
          </label>
          <select
            value={selectedDb}
            onChange={(e) => setSelectedDb(e.target.value)}
            className="form-select w-full appearance-none rounded border border-gray-300 bg-white px-3 py-2 pr-10"
          >
            <option value="">-- Select --</option>
            {databases.map((db) => (
              <option key={db} value={db}>
                {db}
              </option>
            ))}
          </select>

          {/* fake dropdown icon */}
          <div className="right-7.5 pointer-events-none absolute top-[47px] text-gray-600">
            <FontAwesomeIcon icon={faAngleDown} className="h-5 w-5" />
          </div>
        </div>

        {/* current password */}
        <div className="w-md m-2 px-4 py-2">
          <label className="block pb-1 font-semibold text-black">
            Current Password
          </label>
          <div className="relative">
            <input
              id="current-pw"
              type={showCurrent ? 'text' : 'password'}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="bg-white-blue w-full rounded border border-gray-300 px-3 py-2 pr-10"
            />
            {/* eye icon */}
            <button
              type="button"
              onClick={() => setShowCurrent(!showCurrent)}
              className="absolute right-4 top-2.5 text-gray-600"
            >
              <FontAwesomeIcon icon={showCurrent ? faEye : faEyeSlash} />
            </button>
          </div>
        </div>

        {/* new password */}
        <div className="w-md m-2 px-4 py-2">
          <label className="block pb-1 font-semibold text-black">
            New Password
          </label>
          <div className="relative">
            <input
              id="new-pw"
              type={showNew ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="bg-white-blue w-full rounded border border-gray-300 px-3 py-2 pr-10"
            />
            {/* eye icon */}
            <button
              type="button"
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
                    ? '#898785' // neutral
                    : passwordValidation.length
                      ? '#42814A' // valid
                      : '#CE3E39', // invalid
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
                color: passwordValidation.upper ? '#42814A' : '#898785',
              }}
            >
              {passwordValidation.upper ? '✓' : '•'} One uppercase alphabet
              letter (A…Z)
            </li>

            <li
              style={{
                color: passwordValidation.lower ? '#42814A' : '#898785',
              }}
            >
              {passwordValidation.lower ? '✓' : '•'} One lowercase alphabet
              letter (a…z)
            </li>

            <li
              style={{
                color: passwordValidation.digit ? '#42814A' : '#898785',
              }}
            >
              {passwordValidation.digit ? '✓' : '•'} One number (0–9)
            </li>

            <li
              style={{
                color:
                  newPassword.length === 0
                    ? '#898785'
                    : passwordValidation.noSpecial
                      ? '#42814A'
                      : '#CE3E39',
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
                    ? '#898785'
                    : passwordValidation.noLeadingDigit
                      ? '#42814A'
                      : '#CE3E39',
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
              <li style={{ color: '#898785' }}>
                • No historical password (not implemented)
              </li>
              */}
          </ul>
        </div>

        {/* buttons */}
        <div className="m-2 flex items-center justify-between px-4 pt-4">
          <button
            type="submit"
            disabled={!isValid}
            className={`rounded px-4 py-2 text-white ${isValid ? 'bg-blue-800 hover:bg-blue-900' : 'cursor-not-allowed bg-gray-400'}`}
          >
            Change Password
          </button>
          <button
            type="button"
            className="rounded border border-gray-400 px-4 py-2 hover:bg-gray-100"
            onClick={() => {
              setCurrentPassword('');
              setNewPassword('');
              setSelectedDb('');
            }}
          >
            Clear Form
          </button>
        </div>
      </InfoBox>
    </form>
  );
};
