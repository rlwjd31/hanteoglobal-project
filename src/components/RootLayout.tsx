import { Outlet } from "react-router-dom";
import Header from "./templates/Header";

export default function RootLayout() {
  return (
    <div className="w-dvw h-dvh px-2">
      <div className="relative size-full max-w-[768px] flex flex-col bg-orange-100 min-w-[425px] min-h-[900px] mx-auto">
        <Header />
        <main className="mt-(--height-header)">
          <Outlet />
        </main>
        <footer>footer section</footer>
      </div>
    </div>
  );
}
