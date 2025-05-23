import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import Home from './pages/Home/Home';
import Login from './pages/Auth/Login';
import SignUp from './pages/Auth/SignUp';
import ErrorPage from './pages/Error/ErrorPage ';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Root />} />

        <Route path="/dashboard" element={<Home />} />

        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </Router>
  );
};

// Root Component: Token
const Root = () => {
  const isAuthenticated = !!localStorage.getItem('token');
  return isAuthenticated ? (
    <Navigate to="/dashboard" replace />
  ) : (
    <Navigate to="/login" replace />
  );
};

export default App;
