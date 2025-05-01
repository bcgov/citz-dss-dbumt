import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTriangleExclamation,
  faCircleExclamation,
} from '@fortawesome/free-solid-svg-icons';
import { useState, useEffect } from 'react';
import { DateWarning } from '../../utilities/DateWarning';

interface RoundedRowProps {
  key?: number;
  nameText: string;
  date: Date;
  colour?: string;
}

interface RoundedTableProps {
  nameHeader: string;
  detailHeader: string;
  rowArray: RoundedRowProps[];
}

/**
 * RoundedRow component that displays a row with a name and date
 * It also shows a warning icon and red text if the date is within 10 days of today
 *
 * @param props - RoundedRowProps object containing key, nameText, date, and optional colour
 * @returns JSX.Element - The rendered RoundedRow component
 */
const RoundedRow = (props: RoundedRowProps) => {
  // State for showing warning icon and red text colour
  const [showWarningIcon, setShowWarning] = useState(false);
  const [showAlertIcon, setShowAlert] = useState(false);
  let textColour = 'black';

  // When props.date changes, check if the red text and warning icon should be shown
  useEffect(() => {
    const { isWarning, isPast } = DateWarning(props.date);
    setShowWarning(isWarning);
    setShowAlert(isPast);
  }, [props.date]);

  textColour = showWarningIcon || showAlertIcon ? 'red' : 'black';

  return (
    <div className="bg-white-blue border-1 border-white-orange ml-2 rounded-lg p-4">
      <div className={`flex justify-between text-${textColour} `}>
        <div className="font-bold">{props.nameText}</div>
        <div>
          {showAlertIcon && (
            <FontAwesomeIcon
              className="pr-2 text-[20px]"
              icon={faCircleExclamation}
            />
          )}
          {showWarningIcon && (
            <FontAwesomeIcon
              className="pr-2 text-[20px]"
              icon={faTriangleExclamation}
            />
          )}
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

/**
 * Table of password information to be displayed inside the InfoBox
 *
 * @param props - RoundedTableProps object containing header information and rowArray elements as RoundedRows
 * @returns JSX.Element - The rendered RoundedTable component
 */
export const RoundedTable = (props: RoundedTableProps) => {
  const { nameHeader, detailHeader, rowArray } = props as RoundedTableProps;

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
