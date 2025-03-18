import { Home } from "./pages/Home";
import AppFooter from "./components/layout/Footer"
import './styles/globals.css';

function App() {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <main style={{ flexGrow: 1 }}>
        <Home />
      </main>
      <AppFooter />
    </div>
  );
}

export default App;
