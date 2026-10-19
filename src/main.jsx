import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import './index.css'
import { ConfigProvider } from "antd";
import { RouterProvider } from "react-router-dom";
import { router } from "./router/Route.jsx";
import { Provider } from "react-redux";
import store from "./redux/store.js";

const theme = {
  token: {
    colorPrimary: "#00BF63",
    colorLink: "#059347",
    fontFamily: "Poppins, sans-serif",
    borderRadius: 8,
  },
  components: {
    Table: { cellPaddingBlock: 14 },
  },
};

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <ConfigProvider theme={theme}>
        <RouterProvider router={router} />
      </ConfigProvider>
    </Provider>
  </StrictMode>
);
