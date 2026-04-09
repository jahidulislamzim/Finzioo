import { createElement } from "react";
import { createRoot } from "react-dom/client";
import ToastContainer, { pushToast } from "./ToastContainer";

let root;
let container;

function init() {
  if (!container) {
    container = document.createElement("div");
    container.id = "global-toast-root"; 
    document.body.appendChild(container);

    root = createRoot(container);
    root.render(
      createElement(ToastContainer)
    );
  }
}

init();

const toast = {
  success: (msg) => pushToast("success", msg),
  error: (msg) => pushToast("error", msg),
  warning: (msg) => pushToast("warning", msg),
  info: (msg) => pushToast("info", msg),
};

export default toast;
