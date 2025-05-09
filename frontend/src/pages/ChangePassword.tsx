import { BaseLayout } from '../components/layout/BaseLayout';
import { PageTitleInfo } from '../components/layout/PageTitleInfo';
import { BreadcrumbItem } from '../components/element/Breadcrumb'

export const ChangePassword = () => {
  const title = 'Change Password';
  const collapseText = `ChangePassword Collapse Text`;
  const text = `ChangePassword Text`;

  const breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Home', path: '/' },
    { label: 'Change Password' },
  ];

  return (
    <BaseLayout breadcrumbItems={breadcrumbItems}>
      <PageTitleInfo title={title} collapseText={collapseText} text={text} />
      <br />
    </BaseLayout>
  );
};