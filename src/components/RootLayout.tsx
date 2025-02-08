import { Outlet } from "react-router-dom";
import Header from "./templates/Header";
import Footer from "./templates/Footer";

export const layoutContainerWidthStyle = "w-full max-w-[768px] min-w-[425px]";

export default function RootLayout() {
  return (
    <div className="w-dvw h-dvh px-2">
      <div
        className={`relative size-full  flex flex-col bg-white min-h-[900px] mx-auto ${layoutContainerWidthStyle}`}
      >
        <Header />
        <main className="flex flex-col items-center justify-center size-full bg-green-200 mt-(--height-header) py-8">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}
