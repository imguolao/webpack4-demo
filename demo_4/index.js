async function getComponent() {
  const { default: _ } = await import('lodash');
  const element = document.createElement('div');
  element.innerHTML = _.join(['hello', 'world'], '-');
  return element;
}

getComponent().then(element => {
  document.body.appendChild(element);
})