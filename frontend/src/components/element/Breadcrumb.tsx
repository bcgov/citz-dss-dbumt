import { Link } from 'react-router-dom';

/**
 * BreadcrumbItem interface defines the properties for each item in the Breadcrumb component.
 *  label: string - The text to be displayed for the breadcrumb item
 *  path?: string - Optional path used for navigation; if not provided, item is displayed as plain text
 */
interface BreadcrumbItem {
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
    <div className="relative w-full">
      <div className="relative z-10 mx-auto py-[14px]">
        <nav className="text-[18px]" aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center space-x-[8px]">
            {' '}
            {/* Figma design has space-x-16px */}
            {items.map((item, index) => (
              <li key={index} className="flex items-center space-x-[8px]">
                {' '}
                {/* Figma design has space-x-16px */}
                {item.path ? (
                  <Link
                    to={item.path}
                    className="text-blue-500 hover:underline"
                  >
                    {' '}
                    {/* Exact text color not viewable on figma design, used as close as possible option */}
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
      <div className="absolute bottom-0 left-1/2 z-0 w-screen -translate-x-1/2 border-t border-gray-200" />
    </div>
  );
};
