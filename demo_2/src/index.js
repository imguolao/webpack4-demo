import Header from './components/Header';
import Content from './components/Content';
import Footer from './components/Footer';
import webpack from './assets/images/webpack.jpg';
import { $ } from './lib/until';
import './index.less';

Header();
Content();
Footer();

if (module.hot) {
  module.hot.accept('./components/Header', () => {
    Header();
  })
}

let root = $('root');
let img = new Image();
img.src = webpack;
img.id = 'img';
root.appendChild(img);

let div = document.createElement('div');
div.classList.add('iconfont', 'icon-chenggong');
root.appendChild(div);