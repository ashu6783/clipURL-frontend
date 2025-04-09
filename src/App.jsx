import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux'; // Add this
import { store } from './redux/store'; // Import the store
import Login from './pages/Login';
import Home from './pages/Home';
import Dashboard from './pages/Dasboard';
import ShortenForm from './components/ShortenForm';

function App() {
  return (
    <Provider store={store}> {/* Wrap with Provider */}
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/home" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/shorten" element={<ShortenForm />} />
          </Routes>
        </div>
      </Router>
    </Provider>
  );
}

export default App;