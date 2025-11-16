import { createRoot } from 'react-dom/client'
import './index.css'
import App from './trash/components/App'
import { Provider } from 'react-redux';
import { store } from './store';

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <App />
  </Provider>,
)
