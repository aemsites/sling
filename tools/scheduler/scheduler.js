/* eslint-disable import/no-absolute-path */
/* eslint-disable no-console */
/* eslint-disable eol-last */
/* eslint-disable import/no-unresolved */

// Import SDK for Document Authoring
import DA_SDK from 'https://da.live/nx/utils/sdk.js';

// Base URL for Document Authoring source
const DA_SOURCE = 'https://admin.da.live/source';
const CRON_TAB_PATH = '.helix/crontab.json';

/**
 * Shows a message in the feedback container with optional error styling
 * @param {string} text - Message text to display
 * @param {boolean} [isError=false] - Whether to style as error message
 */
function showMessage(text, isError = false) {
  const message = document.querySelector('.feedback-message');
  const msgContainer = document.querySelector('.message-wrapper');

  message.innerHTML = text.replace(/\r?\n/g, '<br>');
  message.classList.toggle('error', isError);
  msgContainer.classList.remove('hidden');
}

/**
 * Shows existing schedules for the current path in the feedback container
 * @param {string} path - Current page path to check schedules for
 * @param {Object} json - Crontab data object
 * @param {Array} json.data - Array of schedule entries
 */
function showExistingSchedules(path, json) {
  const existingSchedules = json.data.filter((row) => row.command.includes(path));
  if (existingSchedules.length === 0) {
    showMessage('No scheduling data available', true);
    return;
  }
  const scheduleList = existingSchedules.map((row) => `${row.command.split(' ')[0]}ing at ${row.when}`).join('\r\n');
  showMessage(`Schedules for this page:\r\n${scheduleList}`, false);
}

/**
 * Sends updated scheduling data to the server
 * @param {string} url - API endpoint URL
 * @param {Object} opts - Request options including body and method
 * @param {FormData} opts.body - Form data containing updated schedule
 * @param {string} opts.method - HTTP method (POST)
 * @returns {Promise<Object|null>} Parsed JSON response or null if failed
 */
async function setSchedules(url, opts) {
  // Send request
  try {
    const resp = await fetch(url, opts);
    if (!resp.ok) {
      throw new Error(`Failed to set schedules: ${resp.status}`);
    }
    return resp.json();
  } catch (error) {
    console.error(error.message);
    showMessage('Failed to save schedule, please check console for more details', true);
    return null;
  }
}

/**
 * Fetches current scheduling data from the server
 * @param {string} url - API endpoint URL
 * @param {Object} opts - Request options
 * @param {string} opts.method - HTTP method (GET)
 * @param {Object} opts.headers - Request headers including auth token
 * @returns {Promise<Object|null>} Parsed JSON response or null if failed
 */
async function getSchedules(url, opts) {
  try {
    const resp = await fetch(url, opts);
    if (!resp.ok) {
      throw new Error(`Failed to fetch schedules: ${resp.status}`);
    }
    return resp.json();
  } catch (error) {
    console.error(error.message);
    showMessage('Failed to fetch, please check console for more details', true);
    return null;
  }
}

/**
 * Processes a schedule command by updating the crontab
 * @param {string} url - API endpoint URL
 * @param {Object} opts - Request options
 * @param {string} command - Command type ('preview' or 'publish')
 * @param {string} pagePath - Path of page to schedule
 * @param {string} cronExpression - Schedule expression (e.g. "at 3:00 pm")
 * @returns {Promise<void>}
 */
async function processCommand(url, opts, command, pagePath, cronExpression) {
  // Validate input
  const expression = cronExpression.trim();
  if (!expression) return;

  const json = await getSchedules(url, opts);
  if (!json) {
    showMessage(`Please make sure ${CRON_TAB_PATH} is present and is accessible`, true);
    return;
  }

  json.data = json.data.filter((row) => row.command !== `${command} ${pagePath}`);
  const existingRow = json.data.find((row) => row.command === `${command} ${pagePath}`);
  if (existingRow) {
    showMessage(`Page at "${pagePath}" is already scheduled for "${command}ing ${expression} "`, true);
    return;
  }

  const newRow = {
    when: expression,
    command: `${command} ${pagePath}`,
  };
  json.data.push(newRow);

  // Prepare form data
  const blob = new Blob([JSON.stringify(json)], { type: 'application/json' });
  const body = new FormData();
  body.append('data', blob);
  const newOpts = { ...opts, body, method: 'POST' };
  const newJson = await setSchedules(url, newOpts);
  if (!newJson) return;

  showExistingSchedules(pagePath, await getSchedules(url, opts));
}

/**
 * Initializes the scheduling interface and sets up event handlers
 * @returns {Promise<void>}
 */
(async function init() {
  const { context, token } = await DA_SDK;

  // Create and style the form container
  const formContainer = document.createElement('div');
  formContainer.className = 'scheduler-form-wrapper';

  const msgContainer = document.createElement('div');
  msgContainer.className = 'message-wrapper hidden';

  const message = document.createElement('div');
  message.className = 'feedback-message';
  message.textContent = '';
  msgContainer.append(message);
  // Create the cron expression input group
  const cronGroup = document.createElement('div');
  cronGroup.className = 'input-group';

  // Create text input for cron expression
  const cronInput = document.createElement('input');
  cronInput.type = 'text';
  cronInput.id = 'cron-expression';
  cronInput.placeholder = 'e.g.,at 3:00 pm on monday';
  cronInput.required = true;

  cronInput.addEventListener('invalid', () => {
    cronInput.setCustomValidity('Enter a cron expression');
  });
  cronInput.addEventListener('input', () => {
    cronInput.setCustomValidity('');
  });
  cronInput.addEventListener('valid', () => {
    cronInput.setCustomValidity('');
  });
  // Create label for cron input
  const cronLabel = document.createElement('label');
  cronLabel.htmlFor = 'cron-expression';
  cronLabel.textContent = 'Schedule Expression:';

  // Create help text with examples
  const helpText = document.createElement('small');
  helpText.className = 'help-text';
  helpText.textContent = `
  Enter expressions like:
    "at 3:00 pm"
    "every day at 2:30 pm"
    "at 10:00 am on monday and wednesday"
    "every 60 minutes starting on the 55th minute"
    "at 3:00 pm on the 18th day of May in 2025" `;

  // Create form element
  const form = document.createElement('form');
  form.className = 'scheduler-form';

  // Prevent default form submission
  form.addEventListener('submit', (e) => e.preventDefault());
  // Assemble the input group
  cronGroup.append(cronLabel, cronInput, helpText);

  // Create button group container
  const buttonGroup = document.createElement('div');
  buttonGroup.className = 'button-group';

  // Create preview button
  const schedulePreviewBtn = document.createElement('button');
  schedulePreviewBtn.className = 'schedule-btn';
  schedulePreviewBtn.textContent = 'Preview';
  schedulePreviewBtn.type = 'submit';

  // Create publish button
  const schedulePublishBtn = document.createElement('button');
  schedulePublishBtn.className = 'schedule-btn';
  schedulePublishBtn.textContent = 'Publish';
  schedulePublishBtn.type = 'submit';

  // Create reset button
  const resetBtn = document.createElement('button');
  resetBtn.className = 'schedule-btn';
  resetBtn.textContent = 'Reset';
  resetBtn.type = 'reset';
  // Add all buttons to button group
  buttonGroup.append(schedulePreviewBtn, schedulePublishBtn, resetBtn);

  // Assemble the form
  form.append(cronGroup, buttonGroup);
  formContainer.append(form);
  document.body.append(formContainer, msgContainer);

  // Check for existing schedules
  const url = `${DA_SOURCE}/${context.org}/${context.repo}/${CRON_TAB_PATH}`;
  const opts = {
    method: 'GET',
    headers: {
      Authorization: `Bearer: ${token}`,
    },
  };
  const json = await getSchedules(url, opts);
  if (json && json.data) {
    showExistingSchedules(context.path, json);
  }

  // Handle schedule button click
  schedulePublishBtn.addEventListener('click', () => processCommand(url, opts, 'publish', context.path, cronInput.value));
  schedulePreviewBtn.addEventListener('click', () => processCommand(url, opts, 'preview', context.path, cronInput.value));
}());