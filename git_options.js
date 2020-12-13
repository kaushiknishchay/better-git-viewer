import { clone } from 'isomorphic-git';
import http from 'isomorphic-git/http/web';
import LightningFS from '@isomorphic-git/lightning-fs';

const DB_NAME = 'fs';
const REPO_DIR = '/repo';
const defaultGitOptions = {
  fs,
  http,
  dir: REPO_DIR,
  corsProxy: 'https://cors.isomorphic-git.org',
};

const fs = new LightningFS(DB_NAME, {
  wipe: true,
});

function flushDB() {
  return new Promise((resolve, reject) => {
    const DBDeleteRequest = window.indexedDB.deleteDatabase(DB_NAME);

    DBDeleteRequest.onerror = function (event) {
      reject(event);
    };

    DBDeleteRequest.onsuccess = function (event) {
      resolve(event);
    };
  });
}

function cloneRepo(url, repoBranch = 'master', onProgress, onMessage) {
  return clone({
    ...defaultGitOptions,
    url,
    ref: repoBranch,
    onMessage,
    onProgress,
  });
}

export { fs, defaultGitOptions, REPO_DIR, cloneRepo, flushDB };
