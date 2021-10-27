import { Proxy } from './proxy';
import cfg from 'config';
import { question } from './misc/util';
import { config } from 'dotenv';
import { ProxyOptions } from './misc/config';
import merge from 'deepmerge';
import { setup } from './misc/setup';
const wait = require('util').promisify(setTimeout)
import { ping } from 'minecraft-protocol'

try {
  config();
} catch {}

//temporary fix until there is top level await is officially supported in nodejs
(async () => {
  if (process.argv.includes('config') || process.argv.includes('setup') || JSON.stringify(cfg) == '{}') Object.assign(cfg, merge(cfg, await setup(merge(new ProxyOptions(), cfg.util.toObject(cfg)))));
  if (process.argv.includes('config')) process.exit(0);

  let failedCount = 0
  while (!(await checkInternet())) {
    await wait(10)
    failedCount++
    if (failedCount > 10) {
      console.info('Exiting because of to main ping fails')
      process.exit(1)
    }
  }
  console.info('Connected to the internet')

  await wait(10)

  const proxy = new Proxy(merge(new ProxyOptions(), cfg));

  while (true) await command(proxy, await question('$ '));
})();

async function checkInternet() {
  const p = new Promise((resolve, reject) => {
    ping({
      host: 'connect.2b2t.org',
      port: 25565,
      version: '1.12.2'
    }, (err, result) => {
      if (err) return reject(err)
      resolve(result)
    })
    setTimeout(() => {
      reject(new Error('timeout'))
    }, 8000)
  })
  try {
    const r = await p
    // @ts-ignore
    const { version, players, description, modinfo, latency } = r || {}
    console.info('Lookup response (internet check)', { version, players, description, modinfo, latency })
    return true
  } catch (err) {
    console.info('Lookup response (internet check) failed with', err)
    return false
  }
}

async function command(proxy: Proxy, cmd: string | null) {
  switch (cmd?.split('0')[0]) {
    case null:
      break;
    case 'quit':
    case 'exit':
      process.exit(0);
    case 'start':
      if (['auth', 'connected', 'afk', 'queue'].includes(proxy.state)) return console.log('Proxy is already running!');
      proxy.state = 'auth';
      console.log('Started the Proxy!');
      break;
    case 'stop':
      if (proxy.state == 'idle') return console.log('Proxy was already stopped!');
      proxy.state = 'idle';
      console.log('Stopped the Proxy!');
      break;
    default:
      break;
  }
}
