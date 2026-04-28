import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { BottomNav } from './BottomNav';
import { Footer } from './Footer';

export function Layout() {
  return (
    <div className="min-h-screen mesh-gradient-bg text-on-surface flex flex-col">
      <Header />
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />
      <BottomNav />
    </div>
  );
}
