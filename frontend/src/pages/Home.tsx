import { GoldBar } from '../components/element/GoldBar';
import { BaseLayout } from '../components/layout/BaseLayout';
import { PageTitleInfo } from '../components/layout/PageTitleInfo';
import { InfoBox, InfoBoxField } from '../components/element/InfoBox';
import { RoundedTable } from '../components/element/RoundedTable';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Heading,
  InlineAlert,
  Button,
} from '@bcgov/design-system-react-components';
import { DateWarning } from '../utilities/DateWarning';
import { JoinArrayWithLast } from '../utilities/JoinArrayWithLast';

// Text for the page including title, hideable text, and additional information
const title = 'Manage your BCGW Oracle account';
const collapseText = `The Database User Management Tool (DBUMT) is managed by Data
          Publication Services team in BC Data Service. This tool is designed
          to help users to securely update their BC Geographic Warehouse
          (BCGW) Oracle account database(s) password(s) and ask for account
          details.`;

/**
 * The Home page is displayed after a user verifies their IDIR and BCGW Oracle username.
 * Information on the BCGW is displayed within a collapsible section. A table of database
 * access and password expiry information is displayed.
 *
 * @returns JSX.Element - The rendered Home component
 */
export const Home = () => {
  // State for showing warning inline alert
  const [showWarningInfo, setShowWarningInfo] = useState(false);
  const [warningDbArray, setWarningDbArray] = useState<string[]>([]);
  const [showAlertInfo, setShowAlertInfo] = useState(false);
  const [alertDbArray, setAlertDbArray] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Pass oracleid to next page
  const location = useLocation();
  const oracleId = location.state?.oracleId;
  // Project navigation
  const navigate = useNavigate();

  const [rowArray, setRowArray] = useState<
    { key: number; nameText: string; date: Date | null }[]
  >([]);

  // Helper to map backend env names
  const mapEnvironmentName = (env: string) => {
    switch (env.toUpperCase()) {
      case 'PROD':
        return 'Production';
      case 'TEST':
        return 'Test';
      case 'DEV':
        return 'Development';
      default:
        return env;
    }
  };

  useEffect(() => {
    if (!oracleId) return;

    const fetchExpiryData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          'http://localhost:3200/verifyAccount/verify',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: oracleId }),
          },
        );

        if (!response.ok) {
          console.error('Failed to fetch expiry data');
          setRowArray([]);
          return;
        }

        const data: { environment: string; pswd_expires: string | null }[] =
          await response.json();

        const mappedRows = data.map((item, index) => ({
          key: index + 1,
          nameText: mapEnvironmentName(item.environment),
          date: item.pswd_expires ? new Date(item.pswd_expires) : null,
        }));

        setRowArray(mappedRows);
      } catch (error) {
        console.error('Error fetching expiry data:', error);
        setRowArray([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchExpiryData();
  }, [oracleId]);

  // If the rowArray updates check if we need to show the warning info and add the database name to the warning array
  useEffect(() => {
    const warnNames: string[] = [];
    const alertNames: string[] = [];

    rowArray.forEach((row) => {
      // Skip environments that returned null expiry (no expiry)
      if (!row.date) return;

      const { isWarning, isPast } = DateWarning(row.date);

      if (isWarning) {
        warnNames.push(row.nameText);
      }
      if (isPast) {
        alertNames.push(row.nameText);
      }
    });

    setWarningDbArray(Array.from(new Set(warnNames)));
    setShowWarningInfo(warnNames.length > 0);
    setAlertDbArray(Array.from(new Set(alertNames)));
    setShowAlertInfo(alertNames.length > 0);
  }, [rowArray]);

  const warningDescription = () => {
    let dbNames = '';
    let plural = '';
    if (warningDbArray.length === 1) {
      dbNames = warningDbArray[0];
    } else if (warningDbArray.length > 1) {
      dbNames = JoinArrayWithLast(warningDbArray, ', ', ' & ');
      plural = 's';
    }
    return `Your BCGW ${dbNames} database password${plural} expire${plural === 's' ? '' : 's'} within 10 days.
        Please reset your password${plural} by selecting 'Change Password' action below.`;
  };

  const alertDescription = () => {
    let dbNames = '';
    let plural = '';
    let hasHave = 'has';
    if (alertDbArray.length === 1) {
      dbNames = alertDbArray[0];
    } else if (alertDbArray.length > 1) {
      dbNames = JoinArrayWithLast(alertDbArray, ', ', ' & ');
      plural = 's';
      hasHave = 'have';
    }
    return `Your BCGW ${dbNames} database password${plural} ${hasHave} expired.
      To reset your password${plural} please contact NRM Service Desk at NRMenquiries@gov.bc.ca.`;
  };

  // If no oracleid, go to login page
  useEffect(() => {
    if (!oracleId) {
      navigate('/login', { replace: true });
    }
  }, [oracleId, navigate]);

  if (!oracleId) return null;

  return (
    <BaseLayout>
      <div className="grid">
        <GoldBar />
        <PageTitleInfo title={title} collapseText={collapseText} />
      </div>
      <br />
      <InfoBox header="BC Geographic Warehouse Oracle Account Information">
        <div className="m-2">
          <InfoBoxField
            titleText="BCGW Account/Username:"
            contentText={oracleId}
          />
        </div>
        <div className="m-2">
          {isLoading ? (
            <div
              role="status"
              aria-live="polite"
              className="flex items-center justify-center p-8"
            >
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />
              <span className="sr-only">Loading environments…</span>
            </div>
          ) : (
            <RoundedTable
              nameHeader="BCGW databases for this account"
              detailHeader="Password Expiry date"
              rowArray={rowArray}
            />
          )}
        </div>

        {!isLoading && showAlertInfo && (
          <div className="m-4">
            <InlineAlert
              description={alertDescription()}
              title="Password Expired"
              variant="danger"
            />
          </div>
        )}
        {!isLoading && showWarningInfo && (
          <div className="m-4">
            <InlineAlert
              description={warningDescription()}
              title="Password Expires Soon"
              variant="warning"
            />
          </div>
        )}
      </InfoBox>
      {/* TODO: may want to create a component for this button nav */}
      <GoldBar />
      <div className="py-4">
        <div className="pb-4">
          <Heading level={2}>Select an Action</Heading>
        </div>
        <div className="flex max-w-md flex-col">
          <div className="pb-4">
            <Button
              variant="primary"
              size="medium"
              onPress={() =>
                navigate('/changepassword', { state: { oracleId } })
              }
            >
              Change Password
            </Button>
          </div>
          <div className="pb-2">
            <Button
              variant="primary"
              size="medium"
              onPress={() => navigate('/accountquery')}
            >
              Query an Account
            </Button>
          </div>
        </div>
      </div>
    </BaseLayout>
  );
};
