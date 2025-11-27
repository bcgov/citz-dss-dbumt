import { Link } from 'react-router-dom';

/**
 * BreadcrumbItem interface defines the properties for each item in the Breadcrumb component.
 *  label: string - The text to be displayed for the breadcrumb item
 *  path?: string - Optional path used for navigation; if not provided, item is displayed as plain text
 */
export interface BreadcrumbItem {
  label: string;
  path?: string;
}

/**
 * BreadcrumbProps interface defines the properties for the Breadcrumb component.
 *  items: BreadcrumbItem[] - An array of breadcrumb items to be rendered in order
 */
interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

/**
 * Breadcrumb component that displays a list of navigation links.
 * Follows BC Gov design system principles to help users understand
 * their current location within the site structure.
 *
 * @param items - Array of BreadcrumbItem objects with label and optional path
 * @returns JSX.Element - The rendered Breadcrumb navigation component
 */
export const Breadcrumb = ({ items }: BreadcrumbProps) => {
  return (
    <div className="w-full">
      {/* Breadcrumb items below mirror the grid layout defined in BaseLayout component */}
      <div className="grid grid-cols-8 gap-2">
        <div className="grid sm:col-start-1 sm:col-end-9 md:col-start-2 md:col-end-8 lg:col-start-3 lg:col-end-7">
          <nav className="text-[18px]" aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center space-x-[8px] py-[14px]">
              {items.map((item, index) => (
                <li key={index} className="flex items-center space-x-[8px]">
                  {item.path ? (
                    <Link to={item.path} className="breadcrumb-link">
                      {item.label}
                    </Link>
                  ) : (
                    <span className="font-bold">{item.label}</span>
                  )}
                  {index < items.length - 1 && <span>/</span>}
                </li>
              ))}
            </ol>
          </nav>
        </div>
      </div>
      {/* Bottom border exists outside of grid layout, allowing it to span the full page width */}
      <div className="w-full border-t border-gray-200" />
    </div>
  );
};
