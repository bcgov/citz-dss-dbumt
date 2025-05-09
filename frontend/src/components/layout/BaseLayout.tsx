import { PropsWithChildren } from 'react';
import { Header } from '@bcgov/design-system-react-components';
import { AppFooter } from './Footer';
import { Breadcrumb, BreadcrumbItem } from '../element/Breadcrumb';

/**
 * BaseLayout component props
 *
 * @param breadcrumbItems - Optional array of breadcrumb items to display above the page content.
 *                          If not provided, the breadcrumb section will not be displayed.
 *                          Each item includes a label and optional navigation path.
 */
interface BaseLayoutProps {
  breadcrumbItems?: BreadcrumbItem[];
}

/**
 * To be used as base layout for all pages. Once imported it can be used as
 * a wrapper for any content.
 * @param props child elements to be shown between header and footer content
 * @returns page to be rendered
 */
export const BaseLayout = ({
  children,
  breadcrumbItems,
}: PropsWithChildren<BaseLayoutProps>) => {
  return (
    <div className="flex h-dvh w-dvw flex-col">
      <Header title="Database User Management Tool" titleElement="h1" />
      {breadcrumbItems && <Breadcrumb items={breadcrumbItems} />}
      <div className="flex-grow">
        <div className="grid-rows-auto grid grid-cols-8 gap-2">
          <div className="grid sm:col-start-1 sm:col-end-9 md:col-start-2 md:col-end-8 lg:col-start-3 lg:col-end-7">
            {children}
          </div>
        </div>
      </div>
      <AppFooter />
    </div>
  );
};

export default BaseLayout;
