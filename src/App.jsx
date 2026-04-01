import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Nav from './components/Nav';
import Map from './components/Map';
import Resources from './pages/Resources';

export default function App() {
  return (
    <BrowserRouter>
      <Nav />
      <Routes>
        <Route path="/" element={<Map />} />
        <Route path="/resources" element={<Resources />} />
      </Routes>
    </BrowserRouter>
  );
}
