import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './LanguageContext';
import LandingPage from './pages/LandingPage';
import ChatPage from './pages/ChatPage';
import ContactAdmin from './pages/ContactAdmin';
import SearchPage from './pages/SearchPage';
import LibraryPage from './pages/LibraryPage';
import CalculatorPage from './pages/CalculatorPage';

const App = () => {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/library" element={<LibraryPage />} />
          <Route path="/admin" element={<ContactAdmin />} />
          <Route path="/calculator" element={<CalculatorPage />} />
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  );
};

export default App;