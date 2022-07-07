import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import Login from "./components/authentication/Login";
import Shell from "./components/shell/Shell";

const App = () => {
  const { adminInfo } = useAuth();

  return (
    <Routes>
      <Route
        path="/"
        element={
          adminInfo ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route
        path="/login"
        element={adminInfo ? <Navigate to="/dashboard" replace /> : <Login />}
      />
      <Route
        path="/dashboard"
        element={adminInfo ? <Shell /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/users"
        element={adminInfo ? <Shell /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/settings"
        element={adminInfo ? <Shell /> : <Navigate to="/login" replace />}
      />
    </Routes>
  );
};

export default App;
