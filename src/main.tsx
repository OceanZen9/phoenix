import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "@/App";
import { BrowserRouter } from "react-router-dom";
import "../index.css"

async function enableMocking() {
  if (import.meta.env.MODE !== 'development') {
    return;
  }
 
  const { worker } = await import('@/mocks/browser');
 
  // `worker.start()` returns a Promise that resolves
  // once the Service Worker is up and ready to intercept requests.
  return worker.start();
}

const root = createRoot(document.getElementById("root")!);

enableMocking().then(() => {
  root.render(
    <StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </StrictMode>
  );
});
