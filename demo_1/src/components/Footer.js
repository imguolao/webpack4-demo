import { $ } from '../lib/until';

export default function Footer () {
  let footer = document.createElement('div');
  footer.innerText = 'footer';
  $('root').appendChild(footer);
}