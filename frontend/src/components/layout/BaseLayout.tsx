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
    <div className='flex flex-col h-dvh w-dvw'>
      <Header title="Database User Management Tool" titleElement="h1" />
      <div className="flex-grow">
        <div className='grid grid-cols-8 grid-rows-auto gap-2'>
          <div className='col-start-2 col-end-8'>
            {props.children}
          </div>
        </div>

      </div>
      <AppFooter />
    </div>
  );
};

export default BaseLayout;
