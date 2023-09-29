import { BrowserRouter } from "react-router-dom";
import AppRouter from "./router/AppRouter";
import CartContexComponent from "./context/CartContex";
import AuthContextComponent from "./context/AuthContext";

function App() {
  return (
    <BrowserRouter>
    <AuthContextComponent>
    <CartContexComponent>
        <AppRouter /> 
    </CartContexComponent>
     </AuthContextComponent>     
    </BrowserRouter>
  );
}

export default App;
