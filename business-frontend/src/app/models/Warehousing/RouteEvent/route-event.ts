import { Route } from '../Route/route'

export class RouteEvent {
    id: number;
    start_date: Date = new Date();
    event_title: string = "";
    route: Route = new Route();
}