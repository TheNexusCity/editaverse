/*
metaversefile uses plugins to load files from the metaverse and load them as apps.
it is an interface between raw data and the engine.
metaversfile can load many file types, including javascript.
*/

import metaversefile from 'metaversefile';
import ERC721 from './erc721-abi.json';
import ERC1155 from './erc1155-abi.json';
import questManager from './quest-manager.js';

const abis = {
  ERC721,
  ERC1155
};

// const apps = [];
metaversefile.setApi({
  // apps,
  async import(s) {
    if (/^(?:ipfs:\/\/|https?:\/\/|weba:\/\/|data:)/.test(s)) {
      const prefix = location.protocol + '//' + location.host + '/@proxy/';
      if (s.startsWith(prefix)) {
        s = s.slice(prefix.length);
      }
      s = `/@proxy/${s}`;
    }
    // console.log('do import', s);
    try {
      const m = await import(s);
      return m;
    } catch (err) {
      console.warn('error loading', JSON.stringify(s), err.stack);
      return null;
    }
  },
  useAbis() {
    return abis;
  },

  useQuests() {
    return questManager;
  }
});

export default metaversefile;
