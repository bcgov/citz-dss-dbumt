import { Heading, Text } from '@bcgov/design-system-react-components';
import { GoldBar } from '../components/element/GoldBar';
import { BaseLayout } from '../components/layout/BaseLayout';
import { InfoBox, InfoBoxField } from '../components/element/InfoBox';

export const Home = () => {
  return (
    <BaseLayout>
      <div className="col-start-2 col-end-8 grid">
        <GoldBar />
        <Heading level={1}>Manage your BCGW Oracle account</Heading>
        <Text>
          <p>
            The Database User Management Tool (DBUMT) is managed by Data
            Publication Services team in BC Data Service. This tool is designed
            to help users to securely update their BC Geographic Warehouse
            (BCGW) Oracle account database(s) password(s) and ask for account
            details. To use this tool please enter your Oracle account username.
            In most cases, the username for your BCGW account matches your IDIR.
          </p>
          <br />
        </Text>
      </div>
      <br />
      <div className="col-start-2 sm:col-end-8 md:col-end-6">
        <InfoBox header="BC Geographic Warehouse Oracle Account Information">
          <InfoBoxField
            titleText="BCGW Account/Username:"
            contentText="TEST HOLDER"
          />
          <br />
        </InfoBox>

        <GoldBar />
        <p>NAV BUTTONS WILL GO HERE</p>
      </div>
    </BaseLayout>
  );
};
