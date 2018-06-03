import './styles/fonts/fonts.scss';
import './styles/main.scss';
import './styles/productPage.scss';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/app';
import { Provider } from 'mobx-react';
import stores from './stores/combinedStores';

ReactDOM.render(
    <Provider { ...stores }>
      <App/>
    </Provider>,
    document.getElementById('app')
  );