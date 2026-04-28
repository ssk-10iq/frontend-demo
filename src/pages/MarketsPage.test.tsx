import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import MarketsPage from './MarketsPage';

function renderAtCategory(category: string) {
  const router = createMemoryRouter(
    [{ path: '/markets', element: <MarketsPage /> }],
    { initialEntries: [`/markets?category=${encodeURIComponent(category)}`] },
  );
  render(<RouterProvider router={router} />);
}

describe('MarketsPage', () => {
  describe('subcategory filter', () => {
    it('resets to All when navigating to a different category', () => {
      renderAtCategory('Crypto');

      // Select the Bitcoin subcategory.
      // The mobile chip has accessible name "Bitcoin" (no icon prefix);
      // the sidebar entry renders as "currency_bitcoinBitcoin" due to icon text.
      fireEvent.click(screen.getByRole('button', { name: 'Bitcoin' }));

      // Navigate to Politics via the "Other Categories" sidebar.
      // jsdom concatenates icon text + label without whitespace → "gavelPolitics".
      fireEvent.click(screen.getByRole('button', { name: 'gavelPolitics' }));

      // Without the fix, activeSubcat would still be 'Bitcoin'. No Politics
      // market has subcategory='Bitcoin', so the list would be empty.
      expect(screen.queryByText('No markets found.')).not.toBeInTheDocument();
    });
  });
});
