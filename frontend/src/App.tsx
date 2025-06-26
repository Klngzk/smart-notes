// TODO: fix "any" types for req
// TODO: fix "any" type in routes
// TODO: Max character in backend
// TODO: Timer for verification link expiration
// TODO: Fix spam toast clicking
// TODO: Password forgot (auth)
// TODO: custom form validation

import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./routes/appRoutes";

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
