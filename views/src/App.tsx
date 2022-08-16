import { Routes, Route, Navigate } from 'react-router-dom';

import '~/assets/images/icons.svg';

import { Welcome } from '~/pages/Welcome';
import { Layout } from '~/pages/Layout';
import { Home } from '~/pages/Home';
import { ItemCreate } from '~/pages/ItemCreate';

import useIcon from '~/hooks/useIcon';

function App() {
  useIcon();

  return (
    <div>
      <Routes>
        <Route element={<Layout />}>
          <Route path='/home' element={<Home />} />
          <Route path='/item'>
            <Route index element={<ItemCreate />} />
          </Route>
        </Route>
        <Route path='/welcome' element={<Welcome />} />
        <Route path='*' element={<Navigate to='/welcome' replace />} />
      </Routes>
    </div>
  );
}

export default App;
