import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import History from './pages/History';

export default function App() {
  return (
    <Router>
      <nav>
        <Link to="/">Главная</Link> | <Link to="/history">История</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/history" element={<History />} />
        <Route path="*" element={<h2>404 - Страница не найдена</h2>} />
      </Routes>
    </Router>
  );
}
