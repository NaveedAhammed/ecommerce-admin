import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { Toaster } from "react-hot-toast";
import { AdminContextProvider } from "./context/AdminContext.tsx";
import { ManageProductContextProvider } from "./context/ManageProductContext.tsx";
import { ManageColorContextProvider } from "./context/ManageColorContext.tsx";
import { ManageCategoryContextProvider } from "./context/ManageCategoryContext.tsx";
import { ManageSizeContextProvider } from "./context/ManageSizeContext.tsx";
import { Provider } from "react-redux";
import { store } from "./redux/store.ts";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AdminContextProvider>
      <Provider store={store}>
        <ManageProductContextProvider>
          <ManageColorContextProvider>
            <ManageCategoryContextProvider>
              <ManageSizeContextProvider>
                <Toaster />
                <App />
              </ManageSizeContextProvider>
            </ManageCategoryContextProvider>
          </ManageColorContextProvider>
        </ManageProductContextProvider>
      </Provider>
    </AdminContextProvider>
  </React.StrictMode>
);
