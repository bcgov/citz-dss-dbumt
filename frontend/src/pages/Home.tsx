import { GoldBar } from '../components/element/GoldBar';
import { BaseLayout } from '../components/layout/BaseLayout';
import { PageTitleInfo } from '../components/layout/PageTitleInfo';
import { InfoBox, InfoBoxField } from '../components/element/InfoBox';
import { RoundedTable } from '../components/element/RoundedTable';
import { useEffect, useState, useMemo } from 'react';
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

  // Pass oracleid to next page
  const location = useLocation();
  const oracleId = location.state?.oracleId;
  // Project navigation
  const navigate = useNavigate();

  /**
   * TESTING PURPOSES ONLY. Once we connect to the backend and BCGW this will be populated
   * with data from the BCGW and passed in through props.
   */
  const rowArray = useMemo(
    () => [
      {
        key: 1,
        nameText: 'Production',
        date: new Date('2024-11-25T00:00:00-07:00'),
      },
      {
        key: 2,
        nameText: 'Test',
        date: new Date('2026-04-30T00:00:00-07:00'),
      },
      {
        key: 3,
        nameText: 'Development',
        date: new Date('2025-05-07T00:00:00-07:00'),
      },
    ],
    [],
  );

  // If the rowArray updates check if we need to show the warning info and add the database name to the warning array
  useEffect(() => {
    const warnNames: string[] = [];
    const alertNames: string[] = [];

    rowArray.forEach((row) => {
      const { isWarning, isPast } = DateWarning(row.date);

      if (isWarning) {
        warnNames.push(row.nameText);
      }
      if (isPast) {
        alertNames.push(row.nameText);
      }
    });

    setWarningDbArray((prev) => Array.from(new Set([...prev, ...warnNames])));
    setShowWarningInfo(warnNames.length > 0);
    setAlertDbArray((prev) => Array.from(new Set([...prev, ...alertNames])));
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
          <RoundedTable
            nameHeader="BCGW databases for this account"
            detailHeader="Password Expiry date"
            rowArray={rowArray}
          />
        </div>
        {showAlertInfo && (
          <div className="m-4">
            <InlineAlert
              description={alertDescription()}
              title="Password Expired"
              variant="danger"
            />
          </div>
        )}
        {showWarningInfo && (
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
