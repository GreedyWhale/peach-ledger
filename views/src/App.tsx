import { Routes, Route } from 'react-router-dom';

import { Welcome } from '~/pages/Welcome';
import { Layout } from '~/pages/Layout';
import { Home } from '~/pages/Home';

function App() {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<Home />} />
        </Route>
        <Route path='/welcome' element={<Welcome />} />
      </Routes>
    </div>
  );
}

export default App;
