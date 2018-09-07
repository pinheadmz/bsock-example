const bsock = require('bsock');
const {Network, Address, Headers, ChainEntry} = require('bcoin');
const network = Network.get('regtest');
const apiKey = 'api-key';

nodeSocket = bsock.connect(network.rpcPort);

nodeSocket.on('connect', async (e) => {
  try {

    console.log('Node - Connect event:\n', e);
    console.log('Node - Attempting auth:\n', await nodeSocket.call('auth', apiKey));
    console.log('Node - Attempting watch chain:\n', await nodeSocket.call('watch chain'));
    console.log('Node - Attempting get tip:');
    const tip = await nodeSocket.call('get tip');
    console.log(ChainEntry.fromRaw(tip));

  } catch (e) {
    console.log('Node - Connection Error:\n', e);
  } 
});

nodeSocket.bind('version', (version) => {
  console.log('Node - Version Event -- version:\n', version);
});

nodeSocket.bind('block connect', (raw, txs) => {
  console.log('Node - Block Connect Event -- raw:\n', ChainEntry.fromRaw(raw));
  console.log('Node - Block Connect Event -- txs:\n', txs); // requires bloom filter
});

nodeSocket.bind('chain connect', (raw, txs) => {
  console.log('Node - Chain Connect Event -- raw:\n', ChainEntry.fromRaw(raw));
});

walletSocket = bsock.connect(network.walletPort);

walletSocket.on('connect', async (e) => {
  try {

    console.log('Wallet - Connect event:\n', e);
    console.log('Wallet - Attempting auth:\n', await walletSocket.call('auth', apiKey));
    console.log('Wallet - Attempting join *:\n', await walletSocket.call('join', '*'));

  } catch (e) {
    console.log('Wallet - Connection Error:\n', e);
  } 
});

walletSocket.bind('tx', (wallet, tx) => {
  console.log('Wallet - TX Event -- wallet:\n', wallet);
  console.log('Wallet - TX Event -- tx:\n', tx);
});

walletSocket.bind('address', (wallet, json) => {
  console.log('Wallet - Address Event -- wallet:\n', wallet);
  console.log('Wallet - Address Event -- json:\n', json);
});
