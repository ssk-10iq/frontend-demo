import { createBrowserRouter } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { ProtectedRoute } from './ProtectedRoute';

// Pages (to be implemented)
import HomePage from '@/pages/HomePage';
import MarketsPage from '@/pages/MarketsPage';
import MarketDetailPage from '@/pages/MarketDetailPage';
import PortfolioPage from '@/pages/PortfolioPage';
import ProfilePage from '@/pages/ProfilePage';
import EditProfilePage from '@/pages/EditProfilePage';
import AdminPage from '@/pages/AdminPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'markets',
        children: [
          {
            index: true,
            element: <MarketsPage />,
          },
          {
            path: ':id',
            element: <MarketDetailPage />,
          },
        ],
      },
      {
        path: 'portfolio',
        element: (
          <ProtectedRoute>
            <PortfolioPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'profile',
        children: [
          {
            index: true,
            element: <ProfilePage />,
          },
          {
            path: 'edit',
            element: (
              <ProtectedRoute>
                <EditProfilePage />
              </ProtectedRoute>
            ),
          },
        ],
      },
      {
        path: 'admin',
        element: <AdminPage />,
      },
    ],
  },
]);
