import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Tasks from "./pages/Tasks";
import { DarkModeProvider } from "./contexts/DarkModeContext.tsx";

import "./index.css";

function App() {
  return (
    <DarkModeProvider>
      <Router>
        <div className='App'>
          <Layout>
            <Routes>
              <Route path='/' element={<Tasks />} />
              <Route path='*' element={<Tasks />} />
            </Routes>
          </Layout>
        </div>
      </Router>
    </DarkModeProvider>
  );
}

export default App;
