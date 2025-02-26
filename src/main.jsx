import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import './index.css'
import Home from "./home/Home.jsx";

import { RouterProvider } from "react-router-dom";
import { router } from "./router/route.jsx";
import { Provider } from "react-redux";
import store from "./redux/store.js";
 
 

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}> 
    <RouterProvider router={router}>
      <Home></Home>
    </RouterProvider>
    </Provider>
  </StrictMode>
);
