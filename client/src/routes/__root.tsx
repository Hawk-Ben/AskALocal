import { createRootRoute, Outlet } from '@tanstack/react-router'

export const Route = createRootRoute({

    component: () => ( // We can put the header here eventually or a footer but right now it just looks bad.
        <>
            {/* <nav>
                <Link to="/">/</Link>
            </nav> */}
            <Outlet/>
        </>
    ),
})