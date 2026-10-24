import React from 'react';
import TaskStats from './components/TaskStats';
import TaskList from './components/TaskList';
import Footer from './components/Footer';
import Sidebar from './components/Sidebar';
import './App.css';

const App: React.FC = () => {
  return (
    <div className="app-container">
      <div className="app-layout">
        <Sidebar />
        <main className="main-content">
          <header className="main-header">
            <h1>TaskFlow</h1>
            <TaskStats />
          </header>
          <TaskList />
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default App;