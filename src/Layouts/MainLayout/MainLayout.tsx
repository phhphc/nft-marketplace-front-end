import Header from "@Components/Header/Header";
import Footer from "@Components/Footer/Footer";

export interface IMainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: IMainLayoutProps) => {
  return (
    <div>
      <Header />
      <div className="px-5 pb-5 mt-24 min-h-screen">{children}</div>
      <Footer />
    </div>
  );
};

export default MainLayout;
