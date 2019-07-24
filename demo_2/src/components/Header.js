import { $ } from '../lib/until';

export default function Header () {
  let header = document.createElement('div');
  header.innerText = '修改后的header';
  $('root').appendChild(header);
}