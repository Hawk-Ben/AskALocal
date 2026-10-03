import { createFileRoute } from "@tanstack/react-router";
import MapView from "../../components/MapView";

export const Route = createFileRoute('/_auth/')({
    component: () => (<MapView/>),
})
