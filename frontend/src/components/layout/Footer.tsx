import { Footer } from '@bcgov/design-system-react-components';

export const AppFooter = () => {
  //Because of some styling, we are using children prop to pass footer links, rather than using FooterLink component
  const footerLinks = (
    <ul className="footer-links">
      <li>
        <a href="https://www2.gov.bc.ca/gov/content/home/disclaimer">
          Disclaimer
        </a>
      </li>
      <li>
        <a href="https://www2.gov.bc.ca/gov/content/home/privacy">Privacy</a>
      </li>
      <li>
        <a href="https://www2.gov.bc.ca/gov/content/home/copyright">
          Copyright
        </a>
      </li>
      <li>
        <a href="https://dpdd.atlassian.net/servicedesk/customer/portal/1/group/5">
          Contact Us
        </a>
      </li>
    </ul>
  );

  return (
    <div style={{ fontSize: '14px' }}>
      <Footer children={footerLinks}></Footer>
    </div>
  );
};
