import { createElement } from 'react';
import { createRoot } from 'react-dom/client';
import AlertContainer, { pushAlert } from './AlertContainer';

let root;
let container;

function init() {
  if (!container) {
    container = document.createElement("div");
    container.id = "global-alert-root";
    document.body.appendChild(container);

    root = createRoot(container);
    root.render(
      createElement(AlertContainer)
    );
  }
}

init();

const show = (options) => {
  return new Promise((resolve) => {
    pushAlert({
      ...options,
      resolve,
    });
  });
};

const alert = {
  show,
};

export default alert;
