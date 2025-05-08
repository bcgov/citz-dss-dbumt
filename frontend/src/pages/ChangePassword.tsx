import { BaseLayout } from '../components/layout/BaseLayout';
import { PageTitleInfo } from '../components/layout/PageTitleInfo';
import { Breadcrumb } from '../components/element/Breadcrumb';

export const ChangePassword = () => {
  const title = 'Change Password';
  const collapseText = `ChangePassword Collapse Text`;
  const text = `ChangePassword Text`;

  return (
    <BaseLayout>
      {/* Breadcrumb */}
      <Breadcrumb
        items={[{ label: 'Home', path: '/' }, { label: 'Change password' }]}
      />

      <PageTitleInfo title={title} collapseText={collapseText} text={text} />
      <br />
    </BaseLayout>
  );
};
