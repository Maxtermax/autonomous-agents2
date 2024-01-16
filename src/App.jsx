import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from '@/pages/Dashboard/Dashboard';
import Example1 from '@/pages/Example1/Example1';
import Example2 from '@/pages/Example2/Example2';
import Example3 from '@/pages/Example3/Example3';
import Example4 from '@/pages/Example4/Example4';
import Example5 from '@/pages/Example5/Example5';
import Example6 from '@/pages/Example6/Example6';
import Example7 from '@/pages/Example7/Example7';
import Example8 from '@/pages/Example8/Example8';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index path={"/"} element={<Dashboard />} />
        <Route path={"/example1"} element={<Example1 />} />
        <Route path={"/example2"} element={<Example2 />} />
        <Route path={"/example3"} element={<Example3 />} />
        <Route path={"/example4"} element={<Example4 />} />
        <Route path={"/example5"} element={<Example5 />} />
        <Route path={"/example6"} element={<Example6 />} />
        <Route path={"/example7"} element={<Example7 />} />
        <Route path={"/example8"} element={<Example8 />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
