import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from '././my-app/components/login/login.js';

function App() {
  return (
    <div className="App">
          <BrowserRouter>
            <Routes>
            <Route path='/checkout' element={<Login />} />  
              <Route path='*' element={<h1>404 NOT FOUND</h1>} />
            </Routes>
          </BrowserRouter>          
    </div>
  );
}

export default App;