// Import SDK
import DA_SDK from 'https://da.live/nx/utils/sdk.js';

const DA_SOURCE = 'https://admin.da.live/source';

async function sendIt(url, pagePath, json, opts) {
  const newRow = { when: 'at 3:00 pm on the 18th day of May in 2024', command: `preview ${pagePath}` };
  json.data.push(newRow);

  const blob = new Blob([JSON.stringify(json)], { type: 'application/json' });
  const body = new FormData();
  body.append('data', blob);

  opts.body = body;
  opts.method = 'POST';

  const resp = await fetch(url, opts);
  if (!resp.ok) {
    return null;
  }
  return resp.json();
}

async function getIt(url, opts) {
  const resp = await fetch(url, opts);
  if (!resp.ok) {
    console.log(resp.status);
    return null;
  }
  return resp.json();
}

(async function init() {
  const { context, token, actions } = await DA_SDK;

  const btn = document.createElement('button');
  btn.textContent = 'Schedule page for publishing';

  document.body.append(btn);

  const url = `${DA_SOURCE}/${context.org}/${context.repo}/.helix/crontab.json`;
  const opts = {
    method: 'GET',
    headers: {
      Authorization: `Bearer: ${token}`,
    },
  };

  btn.addEventListener('click', async () => {
    const json = await getIt(url, opts);
    if (!json) return;
    const newJson = await sendIt(url, context.path, json, opts);
    if (!newJson) return;
    if (actions.sendText) {
      actions.sendText('Your page has been schedule for publishing');
    }
  });

//   const tagBrowser = document.createElement('da-tag-browser');
//   tagBrowser.project = context.repo;
//   tagBrowser.token = token;
//   tagBrowser.actions = actions;
//   document.body.append(tagBrowser);
}());
