import { createTag } from '../../scripts/utils.js';

async function authenticate() {
  let authURL = 'https://multipass.q.sling.com/as/authorization.oauth2';
  const params = {
    redirect_uri: 'https://ms.q.sling.com/sling-api/oauth-helper/alpha/auth-callback',
    client_id: 'aem_agentless_idp_client',
    response_type: 'code',
  };

  Object.keys(params).forEach((param, index) => {
    if (index === 0) { authURL = authURL.concat(`?${param}=${params[param]}`); } else authURL = authURL.concat(`&${param}=${params[param]}`);
  });

  const config = {
    method: 'GET',
  };

  const response = await fetch(authURL, config);
  const data = await response.json();
  console.log(data);
  if (response.ok && data) {
    if (data.redirect_uri.includes('watch')) {
      window.location = data.redirect_uri;
    }
    console.log(data);
  }
}

export default async function decorate(block) {
  const formContainer = createTag('div', { class: 'signin-form-container' });
  const form = createTag('form', { type: 'submit', class: 'signin-frm' });
  const userName = createTag('input', {
    class: 'input username', type: 'email', name: 'email', placeholder: 'Email Address', required: '', autocomplete: 'emai',
  });
  const usernameLabel = createTag('span', { class: 'username-label' });
  usernameLabel.innerText = 'You\'ll use this to login';

  const password = createTag('input', {
    class: 'input password', type: 'password', name: 'password', placeholder: 'Password', autocomplete: 'current-password',
  });
  const signinBtn = createTag('button', {
    type: 'submit', id: 'signin', value: 'Sign In', class: 'primary',
  });
  const btnText = createTag('span', { class: 'btn-text' });
  btnText.innerText = 'Sign In';
  signinBtn.append(btnText);
  form.append(userName, usernameLabel, password, signinBtn);
  formContainer.append(form);
  block.append(formContainer);
  await authenticate();
  // await initiateAuthCallBack();
}
