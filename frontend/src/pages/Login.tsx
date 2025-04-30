import { Button, TextField } from '@bcgov/design-system-react-components';
import { GoldBar } from '../components/element/GoldBar';
import { BaseLayout } from '../components/layout/BaseLayout';
import { PageTitleInfo } from '../components/layout/PageTitleInfo';
import { InfoBox, InfoBoxFieldTitle } from '../components/element/InfoBox';

export const Login = () => {
  const title = 'Manage your BCGW Oracle account';
  const collapseText = `The Database User Management Tool (DBUMT) is managed by Data
          Publication Services team in BC Data Service. This tool is designed
          to help users to securely update their BC Geographic Warehouse
          (BCGW) Oracle account database(s) password(s) and ask for account
          details.`;
  const text = `To use this tool please enter your Oracle account username.
          In most cases, the username for your BCGW account matches your IDIR`;

  return (
    <BaseLayout>
      <GoldBar />
      <PageTitleInfo title={title} collapseText={collapseText} text={text} />
      <br />
      <InfoBox header="BC Geographic Warehouse Oracle Account Information">
        <div className="w-100 box-content px-10">
          <InfoBoxFieldTitle titleText="BCGW Account/Username" />
          <TextField className="w-md mb-2" />
          <br />
          <Button>Continue</Button>
        </div>
      </InfoBox>
    </BaseLayout>
  );
};
