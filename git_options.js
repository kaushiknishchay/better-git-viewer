import http from 'isomorphic-git/http/web';
import LightningFS from '@isomorphic-git/lightning-fs';
const fs = new LightningFS('fs');

export const defaultGitOptions = {
  fs,
  http,
  dir: '/repo',
  corsProxy: 'https://cors.isomorphic-git.org',
};
