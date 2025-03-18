import { Footer, FooterLinks } from "@bcgov/design-system-react-components";
import React from "react";

const AppFooter: React.FC = () => {
  return (
    <div style={{ marginTop: "auto", width: "100%" }}>
      <Footer>
        <React.Fragment key=".0">
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
        </React.Fragment>
      </Footer>
    </div>
  );
};
export default AppFooter;
