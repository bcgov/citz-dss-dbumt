import { Footer, FooterLinks } from '@bcgov/design-system-react-components';

export const AppFooter = () => {
  return (
    <Footer>
      <FooterLinks
        links={[
          <a href="https://www2.gov.bc.ca/gov/content/home/disclaimer">
            Disclaimer
          </a>,
          <a href="https://www2.gov.bc.ca/gov/content/home/privacy">
            Privacy
          </a>,
          <a href="https://www2.gov.bc.ca/gov/content/home/copyright">
            Copyright
          </a>,
          <a href="https://dpdd.atlassian.net/servicedesk/customer/portal/1/group/5">
            Contact Us
          </a>,
        ]}
        title=""
      />
    </Footer>
  );
};

export const HideFooter = () => {
  return (
    <div>
      <Footer hideAcknowledgement hideLogoAndLinks />
    </div>
  );
};
