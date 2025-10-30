import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTriangleExclamation,
  faCircleExclamation,
} from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import { DateWarning } from '../../utilities/DateWarning';

interface RoundedRowProps {
  key?: number;
  nameText: string;
  date: Date | null;
  colour?: string;
}

interface RoundedTableProps {
  nameHeader: string;
  detailHeader: string;
  rowArray: RoundedRowProps[];
}

type DateStatus = 'danger' | 'warning' | 'white-blue';

const getBackgroundColour = (status: DateStatus) => {
  switch (status) {
    case 'danger':
      return { backgroundColor: 'var(--color-danger)' };
    case 'warning':
      return { backgroundColor: 'var(--color-warning)' };
    default:
      return { backgroundColor: 'var(--color-white-blue)' };
  }
};

/**
 * RoundedRow component that displays a row with a name and date
 * It also shows a warning icon and red text if the date is within 10 days of today
 *
 * @param props - RoundedRowProps object containing key, nameText, date, and optional colour
 * @returns JSX.Element - The rendered RoundedRow component
 */
const RoundedRow = ({ nameText, date }: RoundedRowProps) => {
  // State for showing warning icon and red text colour
  const [dateStatus, setStatus] = useState<DateStatus>('white-blue');

  useEffect(() => {
    if (!date) {
      setStatus('white-blue');
      return;
    }
    const { isWarning, isPast } = DateWarning(date);
    if (isPast) setStatus('danger');
    else if (isWarning) setStatus('warning');
    else setStatus('white-blue');
  }, [date]);

  const isAttn = dateStatus === 'danger' || dateStatus === 'warning';

  return (
    <div
      style={getBackgroundColour(dateStatus)}
      className="border-1 border-white-orange ml-2 rounded-lg p-4"
    >
      <div className={`flex justify-between ${isAttn ? 'text-red-700' : ''}`}>
        <div className="font-bold">{nameText}</div>
        <div>
          {dateStatus === 'danger' && (
            <FontAwesomeIcon
              className="pr-2 text-[20px]"
              icon={faCircleExclamation}
            />
          )}
          {dateStatus === 'warning' && (
            <FontAwesomeIcon
              className="pr-2 text-[20px]"
              icon={faTriangleExclamation}
            />
          )}
          {date
            ? date.toLocaleDateString('en-CA', {
                timeZone: '-07:00',
                month: 'long',
                year: 'numeric',
                day: '2-digit',
              })
            : 'No expiry'}
        </div>
      </div>
    </div>
  );
};

/**
 * Table of password information to be displayed inside the InfoBox
 *
 * @param props - RoundedTableProps object containing header information and rowArray elements as RoundedRows
 * @returns JSX.Element - The rendered RoundedTable component
 */
export const RoundedTable = ({
  nameHeader,
  detailHeader,
  rowArray,
}: RoundedTableProps) => {
  return (
    <>
      <div className="ml-2 px-2 py-4">
        <div className="flex justify-between">
          <div className="font-bold">{nameHeader}</div>
          <div>{detailHeader}</div>
        </div>
      </div>
      <div className="pb-4">
        {rowArray.map((row) => (
          <div key={row.key} className="pb-1">
            <RoundedRow nameText={row.nameText} date={row.date} />
          </div>
        ))}
      </div>
    </>
  );
};
