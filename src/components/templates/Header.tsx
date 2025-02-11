import { layoutContainerWidthStyle } from "../RootLayout";
import TabSwiper from "../organisms/TabSwiper";

export default function Header() {
  return (
    <header
      className={`absolute top-0 left-0 z-50 bg-header h-header ${layoutContainerWidthStyle}`}
    >
      <nav className="h-full cursor-grab">
        <TabSwiper />
      </nav>
    </header>
  );
}
