import React from 'react';
import Footer from './components/Footer';
import './App.css';

const App: React.FC = () => {
  return (
    <div className="app-container">
      <main className="main-content">
        <h1>TaskFlow</h1>
      </main>
      <Footer />
    </div>
  );
};

export default App;