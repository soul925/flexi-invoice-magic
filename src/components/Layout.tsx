
import { ReactNode } from 'react';
import Navbar from './common/Navbar';
import Footer from './common/Footer';

interface LayoutProps {
  children: ReactNode;
  fullWidth?: boolean;
}

const Layout = ({ children, fullWidth = false }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className={`flex-1 pt-24 ${!fullWidth && 'max-w-7xl mx-auto px-6 md:px-12'}`}>
        <div className="page-transition">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
