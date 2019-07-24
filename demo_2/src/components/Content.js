import { $ } from '../lib/until';

export default function Content () {
  let content = document.createElement('div');
  content.innerText = 'content';
  $('root').appendChild(content);
}