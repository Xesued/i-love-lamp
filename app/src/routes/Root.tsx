import { Outlet } from "react-router-dom"

import { StickyNavbar } from "../components/NavBar"

export default function Root() {
  return (
    <div className="h-screen w-screen overflow-scroll">
      <StickyNavbar />
      <div className="mx-auto max-w-screen-md py-6 px-4">
        <Outlet />
      </div>
    </div>
  )
}
