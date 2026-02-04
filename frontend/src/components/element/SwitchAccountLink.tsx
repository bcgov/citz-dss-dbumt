import { useNavigate } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';

export const SwitchAccountLink = () => {
  const { setOracleId } = useUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    setOracleId(null);
    navigate('/login');
  };

  return (
    <button onClick={handleLogout} className="link-button">
      ↩ Switch user
    </button>
  );
};
