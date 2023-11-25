import React from "react"
import ReactDOM from "react-dom/client"
import { Provider } from "react-redux"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { store } from "./state/store"

import AddAnimation from "./routes/AddAnimation"
import Animations from "./routes/Animations"
import App from "./routes/App"
import DeviceAdd from "./routes/DeviceAdd.tsx"
import DeviceEdit from "./routes/DeviceEdit.tsx"
import Devices from "./routes/Devices.tsx"
import Root from "./routes/Root.tsx"
import TestAnimations from "./routes/TestAnimations"

import { ThemeProvider } from "@material-tailwind/react"

import ErrorPage from "./error-page"

import "./index.css"
import { DeviceAnimations } from "./routes/DeviceAnimations.tsx"

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
        path: "animations",
        errorElement: <ErrorPage />,
        children: [
          {
            index: true,
            element: <Animations />,
          },
          {
            path: "new",
            element: <AddAnimation />,
          },
          {
            path: "edit/:id",
            loader: ({ params }) => {
              return params
            },
            element: <AddAnimation />,
          },
        ],
      },
      {
        path: "devices",
        errorElement: <ErrorPage />,
        children: [
          {
            index: true,
            element: <Devices />,
          },
          {
            path: "new",
            element: <DeviceAdd />,
          },
          {
            path: ":deviceGuid/edit",
            loader: ({ params }) => {
              return params
            },
            element: <DeviceEdit />,
          },
          {
            path: ":deviceGuid/animations",
            loader: ({ params }) => {
              return params
            },
            element: <DeviceAnimations />,
          },
        ],
      },
      {
        path: "test",
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
