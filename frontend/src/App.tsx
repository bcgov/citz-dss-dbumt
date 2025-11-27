import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { AccountQuery } from './pages/AccountQuery';
import { ChangePassword } from './pages/ChangePassword';
import { UserProvider } from './contexts/UserContext';

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/accountquery" element={<AccountQuery />} />
          <Route path="/changepassword" element={<ChangePassword />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
