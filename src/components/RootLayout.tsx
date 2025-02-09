import { Outlet } from "react-router-dom";
import Header from "./templates/Header";
import Footer from "./templates/Footer";

export const layoutContainerWidthStyle = "w-full max-w-[768px] min-w-[425px]";

export default function RootLayout() {
  return (
    <div className={`relative flex justify-center h-dvh min-h-[900px] px-2`}>
      <div
        className={`relative h-full bg-white mx-auto pt-(--height-header) pb-(--height-footer) ${layoutContainerWidthStyle}`}
      >
        <Header />
        <main className="flex flex-col items-center justify-center size-full py-4">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}
