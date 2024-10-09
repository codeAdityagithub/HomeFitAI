import { useEffect } from "react";

const useServiceWorker = () => {
  useEffect(() => {
    if ("serviceWorker" in navigator && !navigator.serviceWorker.controller) {
      navigator.serviceWorker.register("/service-worker.js").then(
        (registration) => {
          console.log("ServiceWorker registration successful!");
        },
        (error) => {
          console.log("ServiceWorker registration failed: ", error);
        }
      );
    }
  }, []);
};
export default useServiceWorker;
