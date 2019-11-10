import { Header, Main, Footer } from './components.js';

let app = document.getElementById('app');
app.innerHTML = `
  ${Header()}
  ${Main()}
  ${Footer()}
`;