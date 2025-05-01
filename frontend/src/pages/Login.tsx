import { Heading, Text } from '@bcgov/design-system-react-components';
import { BaseLayout } from '../components/layout/BaseLayout';

export const Login = () => {
  return (
    <BaseLayout>
      <div className="border-gold mt-[52px] mb-[10px] w-[36px] border-t-[4px]"></div>
      <Heading level={1}>Manage your BCGW Oracle account</Heading>
      <Text>
        <p>
          The Database User Management Tool (DBUMT) is managed by Data
          Publication Services team in BC Data Service. This tool is designed to
          help users to securely update their BC Geographic Warehouse (BCGW)
          Oracle account database(s) password(s) and ask for account details. To
          use this tool please enter your Oracle account username. In most
          cases, the username for your BCGW account matches your IDIR.
        </p>
        <br />
        <div className="bg-grey mb-[52px] max-w-md shadow-sm">
          <div className="bg-blue flex h-[65px] items-center justify-start">
            <p className="mx-[17px] text-[20px] font-bold text-white">
              BCGW Oracle Account Information
            </p>
          </div>
          <div className="mx-[27px] mt-[27px] pb-[50px]">
            <p className="text-[16px] font-bold">BCGW Account/Username </p>
            <input
              type="text"
              placeholder=""
              className="bg-light-blue focus:ring-blue mt-[10px] h-[50px] w-full max-w-[277px] rounded-sm text-[24px] focus:ring-2 focus:outline-none"
            />
            <button className="bg-dark-blue hover:bg-blue focus:ring-blue mt-4 block rounded-sm px-4 py-2 font-semibold text-white hover:cursor-pointer focus:ring-2 focus:outline-none">
              Continue
            </button>
          </div>
        </div>
      </Text>
    </BaseLayout>
  );
};
