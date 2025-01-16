import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, Link } from 'react-router-dom';
import CodeToLangue from './pages/CodeToLangue';
import LangueToCode from './pages/LangueToCode';

const App = () => {
  return (
    <Router>
      <div className="flex min-h-screen bg-gray-100">
        <aside className="w-64 bg-blue-800 text-white p-4">
          <nav>
            <ul>
              <li className="mb-4">
                <Link to="/code-to-langue" className="block py-2 px-4 hover:bg-blue-700 rounded">
                  Code to Langue
                </Link>
              </li>
              <li>
                <Link to="/langue-to-code" className="block py-2 px-4 hover:bg-blue-700 rounded">
                  Langue to Code
                </Link>
              </li>
            </ul>
          </nav>
        </aside>
        <main className="flex-grow p-6">
          <Routes>
            {/* Route spécifique pour "Code to Langue" */}
            <Route path="/code-to-langue" element={<CodeToLangue />} />
            
            {/* Route spécifique pour "Langue to Code" */}
            <Route path="/langue-to-code" element={<LangueToCode />} />
            
            {/* Rediriger la racine ("/") vers "/code-to-langue" */}
            <Route path="/" element={<Navigate to="/code-to-langue" />} />
            
            {/* Optionnel : Gérer les routes non trouvées */}
            <Route path="*" element={<h1>404 - Page Not Found</h1>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
