import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Tasks from "./pages/Tasks";
import PaymentSuccess from "./pages/PaymentSuccess";
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
              <Route path='/tasks' element={<Tasks />} />
              <Route path='/payment/success' element={<PaymentSuccess />} />
              <Route path='*' element={<Tasks />} />
            </Routes>
          </Layout>
        </div>
      </Router>
    </DarkModeProvider>
  );
}

export default App;
