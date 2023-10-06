import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom"
import { NextUIProvider } from '@nextui-org/react'


import App from './routes/App'
import Config from './routes/Config'
import Animation from './routes/Animation'
import ErrorPage from './error-page'

import './index.css'
import Root from './routes/Root.tsx'

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
        path: "/animation",
        element: <Animation />,
        errorElement: <ErrorPage />,
      },
      {
        path: "/config",
        element: <Config />,
        errorElement: <ErrorPage />,
      },
    ]
  }
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <NextUIProvider>
      <main className="dark text-foreground bg-background">
        <RouterProvider router={router} />
      </main>
    </NextUIProvider>
  </React.StrictMode>,
)
