import {
  createBrowserRouter,
  Outlet,
  RouteObject,
  RouterProvider,
} from "react-router-dom";
import { routeInfo } from "./contants/route";
import Chart from "./components/pages/Chart";
import Whook from "./components/pages/Whook";
import Events from "./components/pages/Events";
import News from "./components/pages/News";
import Store from "./components/pages/Store";
import ChargeShop from "./components/pages/ChargeShop";

const routes: RouteObject[] = [
  {
    path: "/",
    element: (
      <div>
        <div>레이아웃</div>
        <Outlet />
      </div>
    ),
    children: [
      {
        path: routeInfo.chart.path,
        element: <Chart />,
      },
      {
        path: routeInfo.whook.path,
        element: <Whook />,
      },
      {
        path: routeInfo.events.path,
        element: <Events />,
      },
      {
        path: routeInfo.news.path,
        element: <News />,
      },
      {
        path: routeInfo.store.path,
        element: <Store />,
      },
      {
        path: routeInfo.chargeShop.path,
        element: <ChargeShop />,
      },
    ],
  },
];

const router = createBrowserRouter(routes);

export default function Router() {
  return <RouterProvider router={router} />;
}
