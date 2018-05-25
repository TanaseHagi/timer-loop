import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import { Controller } from "./Controller";

ReactDOM.render(
  <App controller={Controller}/>,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
