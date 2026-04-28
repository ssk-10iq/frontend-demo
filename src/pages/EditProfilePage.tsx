import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';

const WALLET_ADDRESS = '0x3fA8b653114Cc79a64b7e2B7e6D0A4E1234abCD';

const USERNAME_MAX = 30;
const BIO_MAX = 280;

const inputCls =
  'w-full bg-white/5 ghost-border rounded-xl px-4 py-3 text-sm text-on-surface placeholder-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all';

function truncateAddress(addr: string) {
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

type SaveState = 'idle' | 'saving' | 'saved' | 'error';

export default function EditProfilePage() {
  const navigate = useNavigate();

  // Stub initial values — replace with useQuery(getMe) when wiring API
  const [username, setUsername] = useState('');
  const [avatar, setAvatar] = useState('');
  const [bio, setBio] = useState('');
  const [saveState, setSaveState] = useState<SaveState>('idle');

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaveState('saving');

    // Stub: replace with mutateAsync(updateMe({ username, avatar, bio }))
    setTimeout(() => {
      setSaveState('saved');
      setTimeout(() => navigate('/profile'), 1000);
    }, 600);
  }

  const isSaving = saveState === 'saving';
  const isSaved = saveState === 'saved';

  return (
    <div className="max-w-2xl mx-auto pt-[124px] pb-28 md:pb-10 px-4 sm:px-8">

      {/* Page header */}
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={() => navigate('/profile')}
          className="p-2 rounded-xl ghost-border text-on-surface-variant hover:text-on-surface hover:bg-white/5 transition-all"
          aria-label="Back to profile"
        >
          <span className="material-symbols-outlined text-xl">arrow_back</span>
        </button>
        <h1 className="text-xl font-black text-on-surface">Edit Profile</h1>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        {/* Identity card — read-only */}
        <div className="glass-panel rounded-2xl p-6 mb-6 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl flex-shrink-0 flex items-center justify-center bg-gradient-to-br from-primary/40 to-secondary/30 border border-primary/30 text-2xl font-black text-primary select-none">
            0x
          </div>
          <div>
            <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-1">
              Connected Wallet
            </p>
            <p className="font-mono font-bold text-on-surface text-sm">
              {truncateAddress(WALLET_ADDRESS)}
            </p>
            <p className="text-[10px] text-on-surface-variant/60 mt-0.5">
              Wallet address cannot be changed
            </p>
          </div>
        </div>

        {/* Form fields */}
        <div className="glass-panel rounded-2xl p-6 space-y-6">

          {/* Username */}
          <div>
            <label
              htmlFor="username"
              className="block text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-2"
            >
              Display Name
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value.slice(0, USERNAME_MAX))}
              placeholder="e.g. PredictionKing"
              className={inputCls}
              autoComplete="off"
              spellCheck={false}
            />
            <div className="flex justify-between items-center mt-1.5">
              <p className="text-[10px] text-on-surface-variant/60">
                Shown instead of your wallet address
              </p>
              <span className={`text-[10px] ${username.length >= USERNAME_MAX ? 'text-tertiary' : 'text-on-surface-variant/40'}`}>
                {username.length}/{USERNAME_MAX}
              </span>
            </div>
          </div>

          {/* Avatar URL */}
          <div>
            <label
              htmlFor="avatar"
              className="block text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-2"
            >
              Avatar URL
            </label>
            <div className="flex items-center gap-3">
              {/* Preview */}
              <div className="w-10 h-10 rounded-xl flex-shrink-0 overflow-hidden bg-white/5 ghost-border flex items-center justify-center">
                {avatar ? (
                  <img
                    src={avatar}
                    alt="Avatar preview"
                    className="w-full h-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                ) : (
                  <span className="material-symbols-outlined text-on-surface-variant/40 text-lg">
                    person
                  </span>
                )}
              </div>
              <input
                id="avatar"
                type="url"
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                placeholder="https://example.com/avatar.png"
                className={inputCls}
                autoComplete="off"
              />
            </div>
            <p className="text-[10px] text-on-surface-variant/60 mt-1.5">
              Direct link to an image (PNG, JPG, GIF)
            </p>
          </div>

          {/* Bio */}
          <div>
            <label
              htmlFor="bio"
              className="block text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-2"
            >
              Bio
            </label>
            <textarea
              id="bio"
              rows={4}
              value={bio}
              onChange={(e) => setBio(e.target.value.slice(0, BIO_MAX))}
              placeholder="Tell the market what you know…"
              className={`${inputCls} resize-none`}
            />
            <div className="flex justify-end mt-1.5">
              <span className={`text-[10px] ${bio.length >= BIO_MAX ? 'text-tertiary' : 'text-on-surface-variant/40'}`}>
                {bio.length}/{BIO_MAX}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={() => navigate('/profile')}
            disabled={isSaving}
            className="px-5 py-2.5 ghost-border rounded-xl text-sm font-bold text-on-surface-variant hover:text-on-surface hover:bg-white/5 transition-all disabled:opacity-40"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaving || isSaved}
            className="px-6 py-2.5 bg-primary-container text-on-primary-container rounded-xl text-sm font-bold hover:brightness-110 transition-all disabled:opacity-60 flex items-center gap-2 min-w-[110px] justify-center"
          >
            {isSaving && (
              <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>
            )}
            {isSaved && (
              <span className="material-symbols-outlined text-sm">check</span>
            )}
            {isSaving ? 'Saving…' : isSaved ? 'Saved!' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
