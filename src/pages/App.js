import './App.css';
import { createBrowserHistory } from 'history';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { Router } from 'react-router';
import AppRoutes from './AppRoutes';
// import adminRoutes from '../routes/menuroutes';
import { esES } from '@material-ui/core/locale';
import { Provider } from 'react-redux';
import AppContext from './AppContext';
import { store } from '../redux/store';

const history = createBrowserHistory();
const theme = createMuiTheme({
  palette: {
    primary: { main: '#1976d2' }
  },
}, esES)

function App() {
  return (
    // <AppContext.Provider value={{ routes: adminRoutes }}  >
    <Provider store={store} >
      <div className="App">
        <Router history={history} >
          <ThemeProvider theme={theme}>
            <AppRoutes />
          </ThemeProvider>
        </Router>
      </div>
    </Provider>
    // </AppContext.Provider>
  );
}

export default App;
