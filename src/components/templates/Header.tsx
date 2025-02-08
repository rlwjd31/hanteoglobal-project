import { NavLink } from "react-router-dom";
import { routeInfo } from "../../contants/route";

export default function Header() {
  return (
    <header className="absolute w-full top-0 left-0 bg-header h-header">
      <nav className="flex flex-row h-full items-center justify-between font-bold">
        {Object.values(routeInfo).map((route) => (
          <NavLink
            key={route.id}
            to={route.path}
            className={({ isActive }) =>
              isActive ? "text-white" : "text-black"
            }
          >
            <li className="list-none">{route.content}</li>
          </NavLink>
        ))}
      </nav>
    </header>
  );
}
