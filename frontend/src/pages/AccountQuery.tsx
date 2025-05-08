import { BaseLayout } from '../components/layout/BaseLayout';
import { PageTitleInfo } from '../components/layout/PageTitleInfo';
import { Breadcrumb } from '../components/element/Breadcrumb';

export const AccountQuery = () => {
  const title = 'AccountQuery Title';
  const collapseText = `AccountQuery Collapse Text`;
  const text = `AccountQuery Text`;

  return (
    <BaseLayout>
      <Breadcrumb
        items={[{ label: 'Home', path: '/' }, { label: 'Change password' }]}
      />
      <PageTitleInfo title={title} collapseText={collapseText} text={text} />
      <br />
    </BaseLayout>
  );
};
