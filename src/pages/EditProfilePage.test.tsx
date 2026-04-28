import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import EditProfilePage from './EditProfilePage';

// ── Mock useNavigate ──────────────────────────────────────────────────────────

const navigateMock = vi.fn();

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return { ...actual, useNavigate: () => navigateMock };
});

// ── Helpers ───────────────────────────────────────────────────────────────────

function renderPage() {
  return render(
    <MemoryRouter>
      <EditProfilePage />
    </MemoryRouter>,
  );
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('EditProfilePage', () => {
  describe('rendering', () => {
    it('renders the page heading', () => {
      renderPage();
      expect(screen.getByText('Edit Profile')).toBeInTheDocument();
    });

    it('shows the truncated wallet address', () => {
      renderPage();
      // 0x3fA8b653114Cc79a64b7e2B7e6D0A4E1234abCD → 0x3fA8…abCD
      expect(screen.getByText('0x3fA8…abCD')).toBeInTheDocument();
    });

    it('renders the Display Name field', () => {
      renderPage();
      expect(screen.getByLabelText('Display Name')).toBeInTheDocument();
    });

    it('renders the Avatar URL field', () => {
      renderPage();
      expect(screen.getByLabelText('Avatar URL')).toBeInTheDocument();
    });

    it('renders the Bio textarea', () => {
      renderPage();
      expect(screen.getByLabelText('Bio')).toBeInTheDocument();
    });

    it('renders Cancel and Save Changes buttons', () => {
      renderPage();
      expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /save changes/i })).toBeInTheDocument();
    });

    it('shows initial character counters at zero', () => {
      renderPage();
      expect(screen.getByText('0/30')).toBeInTheDocument();
      expect(screen.getByText('0/280')).toBeInTheDocument();
    });

    it('shows the placeholder icon when avatar URL is empty', () => {
      renderPage();
      // Person icon placeholder is rendered when avatar is ''
      const icons = document.querySelectorAll('.material-symbols-outlined');
      const personIcon = Array.from(icons).find((el) => el.textContent === 'person');
      expect(personIcon).toBeTruthy();
    });
  });

  describe('character limits', () => {
    it('enforces the 30-character limit on the username field', () => {
      renderPage();
      const input = screen.getByLabelText('Display Name') as HTMLInputElement;
      fireEvent.change(input, { target: { value: 'a'.repeat(40) } });
      expect(input.value).toHaveLength(30);
    });

    it('enforces the 280-character limit on the bio textarea', () => {
      renderPage();
      const textarea = screen.getByLabelText('Bio') as HTMLTextAreaElement;
      fireEvent.change(textarea, { target: { value: 'x'.repeat(300) } });
      expect(textarea.value).toHaveLength(280);
    });

    it('updates the username character counter as the user types', () => {
      renderPage();
      const input = screen.getByLabelText('Display Name');
      fireEvent.change(input, { target: { value: 'hello' } });
      expect(screen.getByText('5/30')).toBeInTheDocument();
    });

    it('updates the bio character counter as the user types', () => {
      renderPage();
      const textarea = screen.getByLabelText('Bio');
      fireEvent.change(textarea, { target: { value: 'hello world' } });
      expect(screen.getByText('11/280')).toBeInTheDocument();
    });

    it('accepts input up to exactly the username limit', () => {
      renderPage();
      const input = screen.getByLabelText('Display Name') as HTMLInputElement;
      const exactly30 = 'a'.repeat(30);
      fireEvent.change(input, { target: { value: exactly30 } });
      expect(input.value).toBe(exactly30);
    });
  });

  describe('avatar preview', () => {
    it('renders an img element when a URL is entered', () => {
      renderPage();
      const urlInput = screen.getByLabelText('Avatar URL');
      fireEvent.change(urlInput, { target: { value: 'https://example.com/avatar.png' } });
      const img = screen.getByRole('img', { name: 'Avatar preview' });
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute('src', 'https://example.com/avatar.png');
    });

    it('removes the img when the URL is cleared', () => {
      renderPage();
      const urlInput = screen.getByLabelText('Avatar URL');
      fireEvent.change(urlInput, { target: { value: 'https://example.com/avatar.png' } });
      fireEvent.change(urlInput, { target: { value: '' } });
      expect(screen.queryByRole('img', { name: 'Avatar preview' })).not.toBeInTheDocument();
    });
  });

  describe('navigation', () => {
    it('navigates to /profile when the Cancel button is clicked', () => {
      renderPage();
      fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
      expect(navigateMock).toHaveBeenCalledWith('/profile');
    });

    it('navigates to /profile when the back button is clicked', () => {
      renderPage();
      fireEvent.click(screen.getByRole('button', { name: /back to profile/i }));
      expect(navigateMock).toHaveBeenCalledWith('/profile');
    });
  });

  describe('save flow', () => {
    function submitForm() {
      fireEvent.click(screen.getByRole('button', { name: /save changes/i }));
    }

    it('shows "Saving…" and disables the button immediately after submit', () => {
      renderPage();
      submitForm();
      const btn = screen.getByRole('button', { name: /saving/i });
      expect(btn).toBeInTheDocument();
      expect(btn).toBeDisabled();
    });

    it('disables Cancel while saving', () => {
      renderPage();
      submitForm();
      expect(screen.getByRole('button', { name: /cancel/i })).toBeDisabled();
    });

    it('shows "Saved!" after the stub delay completes', () => {
      renderPage();
      submitForm();
      act(() => { vi.advanceTimersByTime(600); });
      expect(screen.getByRole('button', { name: /saved/i })).toBeInTheDocument();
    });

    it('navigates to /profile after the full save sequence', () => {
      renderPage();
      submitForm();
      act(() => { vi.advanceTimersByTime(1700); });
      expect(navigateMock).toHaveBeenCalledWith('/profile');
    });

    it('does not navigate before the save sequence finishes', () => {
      renderPage();
      submitForm();
      act(() => { vi.advanceTimersByTime(500); });
      expect(navigateMock).not.toHaveBeenCalled();
    });
  });
});
