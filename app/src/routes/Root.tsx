
import { Navbar, NavbarContent, NavbarItem, Link, Button } from "@nextui-org/react";
import { Outlet } from "react-router-dom";

export default function Root() {
    return (
        <div className="h-screen w-screen">
            <Navbar position="static">
                <NavbarContent className="hidden sm:flex gap-4" justify="center">
                    <NavbarItem isActive>
                        <Link href="/" aria-current="page">
                            Colors 
                        </Link>
                    </NavbarItem>
                    <NavbarItem isActive>
                        <Link href="/animation" aria-current="page">
                           Animation Test 
                        </Link>
                    </NavbarItem>
                </NavbarContent>
                <NavbarContent justify="end">
                    <NavbarItem>
                        <Link color="foreground" href="/config">
                           Config 
                        </Link>
                    </NavbarItem>
                </NavbarContent>
            </Navbar>
            <div className="content">
                <Outlet />
            </div>
        </div>
    );
}
