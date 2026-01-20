import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import ExamView from './components/ExamView';

function App() {
  const [currentView, setCurrentView] = useState('dashboard'); // 'dashboard', 'examA', 'examB'

  return (
    <div className="app-container">
      {currentView === 'dashboard' && (
        <Dashboard
          onStartExam={(variant) => setCurrentView(variant === 'A' ? 'examA' : 'examB')}
        />
      )}

      {currentView === 'examA' && (
        <ExamView variant="A" onBack={() => setCurrentView('dashboard')} />
      )}

      {currentView === 'examB' && (
        <ExamView variant="B" onBack={() => setCurrentView('dashboard')} />
      )}
    </div>
  );
}

export default App;
