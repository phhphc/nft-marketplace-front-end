import Header from "@Components/Header/Header";
import Footer from "@Components/Footer/Footer";

export interface IMainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: IMainLayoutProps) => {
  return (
    <div>
      <Header />
      <div className="p-5">{children}</div>
      <Footer />
    </div>
  );
};

export default MainLayout;
