/**
 * App.jsx — Solo importa AppRouter; sin lógica de negocio.
 */

import { BrowserRouter } from 'react-router-dom';
import { AuthProvider }  from './context/AuthContext.jsx';
import { AppRouter }     from './routes/AppRouter';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
