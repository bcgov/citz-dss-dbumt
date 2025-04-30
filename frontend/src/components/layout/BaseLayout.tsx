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
    <div className="flex min-h-screen flex-col">
      <div className="w-full">
        <Header title="Database User Management Tool" titleElement="h1" />
      </div>
      <div className="mx-[160px] flex-1">{props.children}</div>
      <div className="w-full">
        <AppFooter />
      </div>
    </div>
  );
};

export default BaseLayout;
