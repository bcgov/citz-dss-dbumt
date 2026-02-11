import {
  Button,
  TextField,
  InlineAlert,
  Text as BCGovText,
} from '@bcgov/design-system-react-components';
import { GoldBar } from '../components/element/GoldBar';
import { BaseLayout } from '../components/layout/BaseLayout';
import { PageTitleInfo } from '../components/layout/PageTitleInfo';
import { InfoBox, InfoBoxFieldTitle } from '../components/element/InfoBox';
import { FormEvent, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';

export const Login = () => {
  const title = 'Manage your BCGW Oracle account';
  const text = (
    <BCGovText>
      The Database User Management Tool (DBUMT) is managed by Data Publication
      Services team in BC Data Service. This tool is designed to help users to
      securely update their BC Geographic Warehouse (BCGW) Oracle account
      database(s) password(s) and ask for account details.
      <br />
      <br />
      To use this tool please enter your Oracle account username. In most cases,
      the username for your BCGW account matches your IDIR
    </BCGovText>
  );

  // get oracle Id from user input as temporary so we can set it in context on submit
  const [oracleId, setTempOracleId] = useState('');

  // Used to set oracleId in context and share across the app
  const { setOracleId } = useUser();

  // Project navigation
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.errorMessage) {
      window.history.replaceState({}, document.title);
    }
  }, [location.state?.errorMessage]);

  const errorMessage = location.state?.errorMessage;

  const handleSubmit = (e?: FormEvent) => {
    e?.preventDefault();
    const id = oracleId.trim();
    setOracleId(id);
    if (!id) return;

    navigate('/');
  };

  return (
    <BaseLayout>
      <GoldBar />
      <PageTitleInfo title={title} text={text} />
      <br />
      <InfoBox header="BC Geographic Warehouse Oracle Account Information">
        {errorMessage && (
          <InlineAlert
            variant="danger"
            title="Verification failed"
            description={errorMessage}
          />
        )}

        <form onSubmit={handleSubmit} noValidate>
          <InfoBoxFieldTitle titleText="BCGW Account/Username" />
          <TextField
            id="oracleId"
            aria-labelledby="oracleLabel"
            className="w-md mb-2"
            value={oracleId}
            onChange={(value) => setTempOracleId(value)}
          />
          <br />
          <Button variant="primary" size="medium" type="submit">
            Continue
          </Button>
        </form>
      </InfoBox>
    </BaseLayout>
  );
};
