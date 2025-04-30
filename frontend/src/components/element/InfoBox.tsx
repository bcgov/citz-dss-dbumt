import { ReactNode } from 'react';

/**
 * InfoBoxProps interface defines the properties for the InfoBox component.
 *  header: string - The header text to be displayed in the InfoBox
 *  children: ReactNode - Optional child elements to be displayed inside the InfoBox
 */
interface InfoBoxProps {
  header: string;
  children?: ReactNode;
}

/**
 * InfoBoxFieldProps interface defines the properties for the InfoBoxField component.
 *  titleText: string - The title text to be displayed
 *  contentText?: string - Optional content text to be displayed to the right of the title
 */
interface InfoBoxFieldProps {
  titleText: string;
  contentText?: string;
}

/**
 * InfoBox component that serves as a container for sub-components. Displays a box following
 *  BC Gov design system guidelines with a header and optional child elements inside.
 * When possilbe use the BC Gov design system components instead of creating
 *  new custom sum-components. Ex. Button, TextField, etc.
 *
 * @param props - InfoBoxProps object containing header and optional children
 * @returns JSX.Element - The rendered InfoBox component
 */
export const InfoBox = (props: InfoBoxProps) => {
  return (
    <div className="bg-grey shadow-sm">
      <InfoBoxHeader headerText={props.header} />
      <div className="p-5">{props.children}</div>
    </div>
  );
};

/**
 * InfoBoxHeader component that displays the header of the InfoBox
 * The header is styled with a blue background and white text
 *
 * @param headerText: string - The text to be displayed in the header
 * @returns JSX.Element - The rendered InfoBoxHeader component
 */
export const InfoBoxHeader = ({ headerText }: { headerText: string }) => {
  return (
    <div className="bg-blue space-before flex h-[65px] items-center justify-start">
      <p className="mx-5 text-[20px] font-bold text-white">{headerText}</p>
    </div>
  );
};

/**
 * InfoBoxFieldTitle component that displays the title of a field
 *
 * @param titleText: string - The text to be displayed as the title of the field
 * @returns JSX.Element - The rendered InfoBoxFieldTitle component
 */
export const InfoBoxFieldTitle = ({ titleText }: { titleText: string }) => {
  return <p className="m-2 font-bold">{titleText}</p>;
};

/**
 * InfoBoxField component that displays a field with a title and content
 * It uses the InfoBoxFieldTitle component to display the title
 *
 * @param props - InfoBoxFieldProps object containing titleText and optional contentText
 * @returns JSX.Element - The rendered InfoBoxField component
 */
export const InfoBoxField = (props: InfoBoxFieldProps) => {
  return (
    <div className="justify-left m-2 flex flex-row items-center space-x-8">
      <InfoBoxFieldTitle titleText={props.titleText} />
      <p>{props.contentText}</p>
    </div>
  );
};
