import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute('/_auth/')({
    component: () => (<><h1>Something</h1></>),
})
