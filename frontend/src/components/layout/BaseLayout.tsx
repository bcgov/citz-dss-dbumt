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
    <div className="grid h-screen w-full grid-cols-8 grid-rows-8 gap-4">
      <div className="col-span-full row-start-1">
        <Header title="Database User Management Tool" titleElement="h1" />
      </div>
      <div className="col-start-2 col-end-8 row-span-4">{props.children}</div>
      <div className="col-span-full content-end">
        <AppFooter />
      </div>
    </div>
  );
};

export default BaseLayout;
