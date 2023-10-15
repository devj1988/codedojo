
import { ProblemPage } from './ProblemPage';
import NavigationBar from './NavigationBar';
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';

function App() {
  return (
    <div className='Main'>
      <NavigationBar/>
      <ProblemPage/>
    </div>
  );
}

export default App;
