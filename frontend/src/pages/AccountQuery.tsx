import { BaseLayout } from '../components/layout/BaseLayout';
import { PageTitleInfo } from '../components/layout/PageTitleInfo';
import { BreadcrumbItem } from '../components/element/Breadcrumb';

export const AccountQuery = () => {
  const title = 'AccountQuery Title';
  const collapseText = 'AccountQuery Collapse Text';
  const text = 'AccountQuery Text';

  const breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Home', path: '/' },
    { label: 'Account Query' },
  ];

  return (
    <BaseLayout breadcrumbItems={breadcrumbItems}>
      <PageTitleInfo title={title} collapseText={collapseText} text={text} />
      <br />
    </BaseLayout>
  );
};
