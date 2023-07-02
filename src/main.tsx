import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { GenericMultiFormContext } from "./App.tsx";
import "./index.css";
import { router } from "./route.tsx";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <GenericMultiFormContext>
      <RouterProvider router={router} />
    </GenericMultiFormContext>
  </React.StrictMode>
);
