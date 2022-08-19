import { Routes, Route, Navigate } from 'react-router-dom';

import '~/assets/images/icons.svg';

import { Layout } from '~/components/Layout';
import { Welcome } from '~/pages/Welcome';
import { Home } from '~/pages/Home';
import { ItemCreate } from '~/pages/ItemCreate';
import { ItemList } from '~/pages/ItemList';
import { TagCreate } from '~/pages/TagCreate';
import { TagUpdate } from '~/pages/TagUpdate';

import useIcon from '~/hooks/useIcon';

function App() {
  useIcon();

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path='/home' element={<Home />} />
        <Route path='/item'>
          <Route index element={<ItemList />} />
          <Route path='create' element={<ItemCreate />} />
        </Route>
        <Route path='/tag'>
          <Route path='create' element={<TagCreate />} />
          <Route path='update' element={<TagUpdate />} />
        </Route>
      </Route>
      <Route path='/welcome' element={<Welcome />} />
      <Route path='*' element={<Navigate to='/welcome' replace />} />
    </Routes>
  );
}

export default App;
