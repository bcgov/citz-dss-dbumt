import { Button, Heading, Text } from '@bcgov/design-system-react-components';
import { useState } from 'react';

/**
 * PageTitleInfo component props
 *
 * @param title - The title of the page
 * @param collapseText - The text to be displayed when the button is clicked
 * @param text - Additional text to be displayed below the title
 */
interface PageTitleInfoProps {
  title: string;
  collapseText?: string;
  text?: string | React.ReactNode;
}

/**
 * Page Title Info component that displays a page's title.
 * Optionally it can display text in a collapsible format and additional text.
 * The component is designed to be used in the header of a page.
 *
 * @param props - PageTitleInfoProps object
 * @returns JSX element to be used as page title and optional elements
 */
export const PageTitleInfo = (props: PageTitleInfoProps) => {
  // State to manage the open/closed state of the collapsible text
  const [open, setOpen] = useState(false);
  // Function to toggle the open/closed state
  const toggleOpen = () => {
    setOpen(!open);
  };

  // Function to render the collapsible text and button
  // If collapseText is provided, it will be displayed in a collapsible format
  // If collapseText is not provided, it will not be displayed
  const Collapse = () => {
    if (props.collapseText) {
      return (
        <>
          <div className="max-w-3xs">
            <Button variant="secondary" size="medium" onPress={toggleOpen}>
              {!open ? 'Show More' : 'Show Less'}
            </Button>
          </div>
          {open && <Text>{props.collapseText}</Text>}
        </>
      );
    }
  };

  // Function to render additional text
  // If text is provided, it will be displayed below the title
  // If text is not provided, it will not be displayed
  const AdditionalText = () => {
    if (props.text) {
      return (
        <>
          {typeof props.text === 'string' ? <Text>{props.text}</Text> : props.text}
          <br />
        </>
      );
    }
  };

  return (
    <>
      <div className="py-4">
        <Heading level={2}>{props.title}</Heading>
      </div>
      <Collapse />
      <br />
      <AdditionalText />
    </>
  );
};
