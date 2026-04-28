import '@testing-library/jest-dom';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// Unmount rendered components after every test so the DOM stays clean.
// @testing-library/react registers this automatically when it detects a global
// afterEach, but since we run with globals:true only in vitest config (not in
// tsconfig), we register it explicitly here to guarantee it always runs.
afterEach(cleanup);
