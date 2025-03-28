import { Heading, Text } from '@bcgov/design-system-react-components';
import { BaseLayout } from '../components/layout/BaseLayout';

export const Home = () => {
  return (
    <BaseLayout>
      <Heading level={1}>Home Page</Heading>
      <Text>
        <p>
          This page uses the `Base Layout` wrapper allowing content to appear
          between the header and footer.
        </p>
        <br />
        <Heading level={3}>More Content</Heading>
        <p>
          This page is the landing page. Currently it isnt very exciting. But we
          can use this to test building out components and will build onto it as
          we go.
        </p>
      </Text>
    </BaseLayout>
  );
};
