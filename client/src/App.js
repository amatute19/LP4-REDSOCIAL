import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Profile from "./pages/profile/Profile";
import Register from "./pages/register/Register";
import Messenger from "./pages/Messenger/Messenger";  // Asegúrate de que la ruta a Messenger sea correcta
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import EventList from "./pages/event/EventList";
import EventCreate from "./pages/event/EventCreate";
import Dashboard from "./pages/dashboard/Dashboard";
function App() {
  const { user } = useContext(AuthContext); // Obtiene el usuario del contexto de autenticación

  return (
    <Router>
      <Routes>
        <Route path="/" element={user ? <Home /> : <Register />} /> {/* Redirige a Home si está autenticado, de lo contrario a Register */}
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} /> {/* Redirige a Home si está autenticado, de lo contrario a Login */}
        <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} /> {/* Redirige a Home si está autenticado, de lo contrario a Register */}
        <Route path="/messenger" element={user ? <Messenger /> : <Navigate to="/" />} /> {/* Redirige a Home si no está autenticado, de lo contrario a Messenger */}
        <Route path="/profile/:username" element={<Profile />} /> {/* Ruta accesible para todos */}
        <Route path="/events/create" element={user ? <EventCreate /> : <Navigate to="/login" />} /> {/* Ruta para crear eventos */}
        <Route path="/events" element={user ? <EventList /> : <Navigate to="/login" />} /> {/* Ruta para listar eventos */}
        <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} /> {/* Ruta para el dashboard */}      
      </Routes>
    </Router>
  );
}

export default App;








// import Home from "./pages/home/Home";
// import Login from "./pages/login/Login";
// import Profile from "./pages/profile/Profile";
// import Register from "./pages/register/Register";
// import {
//   BrowserRouter as Router,
//   Routes,
//   Route
// } from "react-router-dom";

// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route exact path="/" element={<Home />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/register" element={<Register />} />
//         <Route path="/profile/:username" element={<Profile />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;
