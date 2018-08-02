import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'fullcalendar-reactwrapper/dist/css/fullcalendar.min.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
