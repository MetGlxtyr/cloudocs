import React from 'react';
import ReactDOM from 'react-dom/client';
import { HistoryRouter, history } from '@/utils';

import 'antd/dist/antd.min.css'
import './index.scss';

import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <HistoryRouter history={history} >
      <App />
    </HistoryRouter>
  </React.StrictMode>
);
