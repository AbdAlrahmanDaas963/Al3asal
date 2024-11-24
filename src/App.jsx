import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import LoginPage from "./pages/LoginPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard/*" element={<Dashboard />}>
          {/* Nested routes for dashboard */}
          <Route index element={<h2>Welcome to the Dashboard!</h2>} />
          <Route path="reports" element={<h2>Reports Section</h2>} />
          <Route path="analytics" element={<h2>Analytics Section</h2>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
