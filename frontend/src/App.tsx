import React from "react";
import { Home } from "./pages/Home";
import { Footer, FooterLinks } from "@bcgov/design-system-react-components";

function App() {
  return (
    <>
      <Home />
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
              <a href="https://www2.gov.bc.ca/gov/content/home/get-help-with-government-services">
                Contact Us
              </a>,
            ]}
            title=""
          />
        </React.Fragment>
      </Footer>
    </>
  );
}

export default App;
