import { Outlet } from "react-router-dom";
import Header from "./templates/Header";
import Footer from "./templates/Footer";
import Container from "./atoms/Container";

export const layoutContainerWidthStyle = "w-full max-w-[768px] min-w-[425px]";

export default function RootLayout() {
  return (
    <Container.FlexRow
      className={`relative justify-center h-dvh min-h-[900px] px-2`}
    >
      <Container
        className={`relative h-full bg-white mx-auto pt-(--height-header) pb-(--height-footer) ${layoutContainerWidthStyle}`}
      >
        <Header />
        <main className="flex flex-col items-center justify-center size-full py-4">
          <Outlet />
        </main>
        <Footer />
      </Container>
    </Container.FlexRow>
  );
}
