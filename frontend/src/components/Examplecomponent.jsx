// filepath: d:\KURNIA\otw semester 8\tes TA\vite-project\src\components\ExampleComponent.jsx
import { useNavigate } from 'react-router-dom';

const ExampleComponent = () => {
  const navigate = useNavigate();

  const handleNavigation = () => {
    navigate('/prediksi'); // Navigasi ke halaman prediksi
  };

  return <button onClick={handleNavigation}>Go to Prediksi</button>;
};

export default ExampleComponent;