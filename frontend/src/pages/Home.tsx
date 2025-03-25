import { Header, Text } from "@bcgov/design-system-react-components";
import { AppFooter } from "../components/layout/Footer";

export const Home = () => {
  return (
    <div>
      <Header title="Database User Management Tool" titleElement="h1" />
      <Text elementType="span">
        This page is the landing page. Currently it isnt very exciting. But we
        can use this to test building out components and will build onto it as
        we go.
      </Text>
      <AppFooter />
    </div>
  );
};
