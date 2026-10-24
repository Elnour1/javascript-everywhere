import React from 'react';
import TaskStats from './components/TaskStats';
import TaskList from './components/TaskList.tsx';
import Footer from './components/Footer';
import './App.css';

const App: React.FC = () => {
  return (
    <div className="app-container">
      <main className="main-content">
        <h1>TaskFlow</h1>
        <TaskStats />
        <TaskList />
      </main>
      <Footer />
    </div>
  );
};

export default App;