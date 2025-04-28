import { GoldBar } from '../components/element/GoldBar';
import { BaseLayout } from '../components/layout/BaseLayout';
import { PageTitleInfo } from '../components/layout/PageTitleInfo';
import { InfoBox, InfoBoxField } from '../components/element/InfoBox';
import { useEffect, useState } from 'react';
import { InlineAlert } from '@bcgov/design-system-react-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';

export const Home = () => {
  const [showWarningInfo, setShowWarningInfo] = useState(false);

  const rowArray = [
    {
      key: 1,
      nameText: 'Production',
      date: new Date('2024-11-25T00:00:00-07:00'),
    },
    {
      key: 2,
      nameText: 'Test',
      date: new Date('2025-07-08T00:00:00-07:00'),
    },
    {
      key: 3,
      nameText: 'Development',
      date: new Date('2025-05-07T00:00:00-07:00'),
    },
  ];

  useEffect(() => {
    const hasWarnings = rowArray.some(row => dateWarning(row.date));
    setShowWarningInfo(hasWarnings);
  }, [rowArray]);

  interface RoundedRowProps {
    key: number;
    nameText: string;
    date: Date;
    colour?: string;
  };

  interface RoundedTableProps {
    nameHeader: string;
    detailHeader: string;
    rowArray: RoundedRowProps[];
  };

  const dateWarning = (expiryDate: Date) => {
    const today = new Date();
    const timeDiff = expiryDate.getTime() - today.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysDiff < 10;
  }

  const title = 'Manage your BCGW Oracle account';
  const collapseText = `The Database User Management Tool (DBUMT) is managed by Data
            Publication Services team in BC Data Service. This tool is designed
            to help users to securely update their BC Geographic Warehouse
            (BCGW) Oracle account database(s) password(s) and ask for account
            details.`;
  const text = `To use this tool please enter your Oracle account username.
            In most cases, the username for your BCGW account matches your IDIR.`;

  const nameHeader = 'BCGW databases for this account';
  const detailHeader = 'Password Expiry date';

  const RoundedRow = (props: RoundedRowProps) => {
    const [showWarningIcon, setShowWarning] = useState(false);

    useEffect(() => {
      const warn = dateWarning(props.date);
      setShowWarning(warn);
    }, [props.date]);

    const textColour = showWarningIcon ? 'red' : 'black';

    return (
      <div className="max-w-[560px] rounded-[10px] bg-white-blue ml-2 p-4 border-1 border-white-orange">
        <div className={`flex justify-between text-[16px] text-${textColour} font-[BC_Sans]`}>
          <div className='font-bold'>{props.nameText}</div>
          <div>
            {showWarningIcon && <FontAwesomeIcon className='pr-2 text-[20px]' icon={faTriangleExclamation} />}
            {props.date.toLocaleDateString('en-CA', {
              timeZone: '-07:00',
              month: 'long',
              year: 'numeric',
              day: '2-digit',
            })}
          </div>
        </div>
      </div>
    );
  };

  const RoundedTable = (props: RoundedTableProps) => {
    const { nameHeader, detailHeader, rowArray } = props;
    return (
      <>
        <div className="max-w-[560px] py-4 px-2 ml-2">
          <div className="flex justify-between text-[16px] font-[BC_Sans] font-bold">
            <div>{nameHeader}</div>
            <div>{detailHeader}</div>
          </div>
        </div>

        {rowArray.map(row => (
          <div key={row.key} className="pb-1">
            <RoundedRow
              key={row.key}
              nameText={row.nameText}
              date={row.date}
            />
          </div>
        ))}
      </>
    );
  }

  return (
    <BaseLayout>
      <div className="col-start-2 col-end-8 grid">
        <GoldBar />
        <PageTitleInfo title={title} collapseText={collapseText} text={text} />
      </div>
      <br />
      <div className="col-start-2 sm:col-end-8 md:col-end-6">
        <InfoBox header="BC Geographic Warehouse Oracle Account Information">
          <InfoBoxField
            titleText="BCGW Account/Username:"
            contentText="TEST HOLDER"
          />
          <RoundedTable
            nameHeader={nameHeader}
            detailHeader={detailHeader}
            rowArray={rowArray}
          />
          {showWarningInfo && (
            <InlineAlert
              description='Your BCGW Test database password expires in 10 days. Please reset your password by selecting ‘Change Password’ action below. '
              title='Password Expires Soon'
              variant='warning' />

          )}
        </InfoBox>

        <GoldBar />
        <p>NAV BUTTONS WILL GO HERE</p>
      </div>
    </BaseLayout>
  );
};
