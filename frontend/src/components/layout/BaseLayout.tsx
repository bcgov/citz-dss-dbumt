import { PropsWithChildren } from 'react';
import { Header } from '@bcgov/design-system-react-components';
import { AppFooter } from './Footer';

/**
 * To be used as base layout for all pages. Once imported it can be used as
 * a wrapper for any content.
 * @param props child elements to be shown between header and footer content
 * @returns page to be rendered
 */
export const BaseLayout = (props: PropsWithChildren) => {
  return (
    <div className="flex h-dvh w-dvw flex-col">
      <Header title="Database User Management Tool" titleElement="h1" />
      <div className="flex-grow">
        <div className="grid-rows-auto grid grid-cols-8 gap-2">
          {props.children}
        </div>
      </div>
      <AppFooter />
    </div>
  );
};

export default BaseLayout;
