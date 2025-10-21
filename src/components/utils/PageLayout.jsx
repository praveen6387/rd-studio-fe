import Header from './Header';
import Footer from './Footer';

export default function PageLayout({ children, footer = true, sidebar = false }) {
  return (
    <div className="min-h-screen flex flex-col text-black">
      <Header />
      <main className={`flex-1 ${sidebar ? 'pt-0' : ''}`}>
        {children}
      </main>
      {footer && <Footer />}
    </div>
  );
} 