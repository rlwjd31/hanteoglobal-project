import { Outlet } from "react-router-dom";
import Header from "./templates/Header";
import Footer from "./templates/Footer";
import Container from "./atoms/Container";

export const layoutContainerWidthStyle = "w-full max-w-[768px] min-w-[425px]";

export default function RootLayout() {
  return (
    <div className="w-dvw h-dvh px-2">
      <Container.FlexCol
        className={`relative h-full justify-start bg-white min-h-[900px] mx-auto ${layoutContainerWidthStyle}`}
      >
        <Header />
        <main className="flex flex-col items-center justify-center size-full mt-(--height-header) py-4">
          <Outlet />
        </main>
        <Footer />
      </Container.FlexCol>
    </div>
  );
}
