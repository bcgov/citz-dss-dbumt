import { Home } from "./pages/Home";
import { Header } from "@bcgov/design-system-react-components";

// testing frontend build on PR

function App() {
  return (
    <>
      <Header title="Database User Management Tool" titleElement="h1" />
      <Home />
    </>
  );
}

export default App;
