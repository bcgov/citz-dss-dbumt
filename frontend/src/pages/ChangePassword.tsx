import { BaseLayout } from '../components/layout/BaseLayout';
import { PageTitleInfo } from '../components/layout/PageTitleInfo';
import { BreadcrumbItem } from '../components/element/Breadcrumb';
import { Text as BCGovText } from '@bcgov/design-system-react-components';
import { ChangePasswordForm } from '../components/element/ChangePasswordForm';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export const ChangePassword = () => {
  // Pass oracleid to next page
  const location = useLocation();
  const oracleId = location.state?.oracleId;
  // Project navigation
  const navigate = useNavigate();

  // If no oracleid, go to login page
  useEffect(() => {
    if (!oracleId) {
      navigate('/login', { replace: true });
    }
  }, [oracleId, navigate]);

  if (!oracleId) return null;

  const title = 'Change your BCGW Oracle password';
  const collapseText = ``;
  const text = (
    <BCGovText>
      The BC Geographic Warehouse (BCGW) change password tool helps users of
      BCGW to securely update their BCGW Oracle account password every three
      months. But, to reset an expired password, users need to contact NRM
      Service Desk.&nbsp;
      <a
        href="https://bcgov.github.io/data-publication/pages/faq.html#how-do-i-changereset-my-bcgw-password"
        target="_blank"
        rel="noopener noreferrer"
        className="text-[#255A90] underline"
      >
        Learn more about the process
      </a>
      .
    </BCGovText>
  );
  const breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Home', path: '/' },
    { label: 'Change Password' },
  ];

  return (
    <BaseLayout breadcrumbItems={breadcrumbItems}>
      <PageTitleInfo title={title} collapseText={collapseText} text={text} />
      <br />
      <ChangePasswordForm oracleId={oracleId} />
    </BaseLayout>
  );
};
