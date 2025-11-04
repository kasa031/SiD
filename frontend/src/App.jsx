import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import ToastContainer, { showToast } from './components/Toast';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PollDetailPage from './pages/PollDetailPage';
import CreatePollPage from './pages/CreatePollPage';
import ProfilePage from './pages/ProfilePage';
import PoliticianSearchPage from './pages/PoliticianSearchPage';
import SearchPage from './pages/SearchPage';
import StatsPage from './pages/StatsPage';

// Make showToast available globally
window.showToast = showToast;

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Layout>
          <ToastContainer />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/poll/:id" element={<PollDetailPage />} />
          <Route path="/poll/:pollId/stats" element={<StatsPage />} />
          <Route 
            path="/create-poll" 
            element={
              <ProtectedRoute>
                <CreatePollPage />
              </ProtectedRoute>
            } 
          />
          <Route path="/profile/:id" element={<ProfilePage />} />
          <Route path="/politician-search" element={<PoliticianSearchPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/stats" element={<StatsPage />} />
        </Routes>
        </Layout>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;

