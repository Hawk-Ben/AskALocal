import { createFileRoute, redirect } from '@tanstack/react-router'

// The "_" prefix means this folder doesnt add anything to the URL
// I want to keep pages that require auth inside routes/_auth/
export const Route = createFileRoute('/_auth')({
    beforeLoad: async () => {
        const res = await fetch('/api/auth/me')
        if (!res.ok) {
            throw redirect({ to: '/login' })
        }
    },
})
