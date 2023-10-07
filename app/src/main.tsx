import React from "react"
import ReactDOM from "react-dom/client"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { store } from "./state/store"
import { Provider } from "react-redux"

import App from "./routes/App"
import Lamps from "./routes/Lamps"
import AddLamp from "./routes/AddLamp"
import Animations from "./routes/Animations"
import TestAnimations from "./routes/TestAnimations"
import Root from "./routes/Root.tsx"

import { ThemeProvider } from "@material-tailwind/react";

import ErrorPage from "./error-page"

import "./index.css"

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <App />,
      },
      {
        path: "/animations",
        element: <Animations />,
        errorElement: <ErrorPage />,
      },
      {
        path: "/lamps",
        element: <Lamps />,
        errorElement: <ErrorPage />,
      },
      {
        path: "/add-lamp",
        element: <AddLamp />,
        errorElement: <ErrorPage />,
      },
      {
        path: "/test",
        element: <TestAnimations />,
        errorElement: <ErrorPage />,
      },
    ],
  },
])

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <main className="dark text-foreground bg-background">
          <RouterProvider router={router} />
        </main>
      </ThemeProvider>
    </Provider>
  </React.StrictMode>,
)
