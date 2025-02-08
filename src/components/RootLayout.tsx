import { Outlet } from "react-router-dom";
import Header from "./templates/Header";
import Footer from "./templates/Footer";

export default function RootLayout() {
  return (
    <div className="w-dvw h-dvh px-2">
      <div className="relative size-full max-w-[768px] flex flex-col bg-white min-w-[425px] min-h-[900px] mx-auto">
        <Header />
        <main className="flex flex-col items-center justify-center size-full bg-green-200 mt-(--height-header)">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}
