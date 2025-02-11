import {
  createBrowserRouter,
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
import RootLayout from "./components/RootLayout";
import PageWrapper from "./components/organisms/PageWrapper";
import PageNotFound from "./components/pages/PageNotFound";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: (
          <PageWrapper
            currentPage={<Chart />}
            nextPage={<Whook />}
            prevPage={<ChargeShop />}
            nextPath={routeInfo.whook.path}
            prevPath={routeInfo.chargeShop.path}
          />
        ),
      },
      {
        path: routeInfo.whook.path,
        element: (
          <PageWrapper
            currentPage={<Whook />}
            nextPage={<Events />}
            prevPage={<Chart />}
            nextPath={routeInfo.events.path}
            prevPath={routeInfo.chart.path}
          />
        ),
      },
      {
        path: routeInfo.events.path,
        element: (
          <PageWrapper
            currentPage={<Events />}
            nextPage={<News />}
            prevPage={<Whook />}
            nextPath={routeInfo.news.path}
            prevPath={routeInfo.whook.path}
          />
        ),
      },
      {
        path: routeInfo.news.path,
        element: (
          <PageWrapper
            currentPage={<News />}
            nextPage={<Store />}
            prevPage={<Events />}
            nextPath={routeInfo.store.path}
            prevPath={routeInfo.events.path}
          />
        ),
      },
      {
        path: routeInfo.store.path,
        element: (
          <PageWrapper
            currentPage={<Store />}
            nextPage={<ChargeShop />}
            prevPage={<News />}
            nextPath={routeInfo.chargeShop.path}
            prevPath={routeInfo.news.path}
          />
        ),
      },
      {
        path: routeInfo.chargeShop.path,
        element: (
          <PageWrapper
            currentPage={<ChargeShop />}
            nextPage={<Chart />}
            prevPage={<Store />}
            nextPath={routeInfo.chart.path}
            prevPath={routeInfo.store.path}
          />
        ),
      },
      {
        path: "*",
        element: <PageNotFound />,
      },
    ],
  },
];

const router = createBrowserRouter(routes);

export default function Router() {
  return <RouterProvider router={router} />;
}
