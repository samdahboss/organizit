import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Tasks from "./pages/Tasks";

import './index.css'

function App() {
  return (
    <Router>
      <div className="App">
        <Layout>
          <Routes>
            <Route path="/" element={<Tasks />} />
            <Route path="*" element={<Tasks />} />
          </Routes>
        </Layout>
      </div>
    </Router>
  );
}

export default App;
