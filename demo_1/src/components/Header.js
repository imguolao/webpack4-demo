import { $ } from '../lib/until';

export default function Header () {
  let header = document.createElement('div');
  header.innerText = 'header';
  $('root').appendChild(header);
}