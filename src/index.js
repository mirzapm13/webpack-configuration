import 'file-loader?name=[name].[ext]!./index.html'
import 'regenerator-runtime'
import 'babel-polyfill'
import 'whatwg-fetch'
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('app'));
root.render(
    <App />
);