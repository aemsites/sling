/* eslint-disable import/no-absolute-path */
/* eslint-disable no-console */
/* eslint-disable eol-last */
/* eslint-disable import/no-unresolved */

// Import SDK for Document Authoring
import DA_SDK from 'https://da.live/nx/utils/sdk.js';

// Base URL for Document Authoring source
const DA_SOURCE = 'https://admin.da.live/source';
const CRON_TAB_PATH = '.helix/crontab.json';
const AEM_PREVIEW_REQUEST_URL = 'https://admin.hlx.page/preview';

// Add overlay div to the body
const overlay = document.createElement('div');
overlay.className = 'overlay';
document.body.appendChild(overlay);

/**
 * Shows a message in the feedback container with optional error styling
 * @param {string} text - Message text to display
 * @param {boolean} [isError=false] - Whether to style as error message
 * @param {boolean} [isLoading=false] - Whether to style as loading state
 */
function showMessage(text, isError = false, isLoading = false) {
  const message = document.querySelector('.feedback-message');
  const msgContainer = document.querySelector('.message-wrapper');

  message.innerHTML = text.replace(/\r?\n/g, '<br>');
  message.classList.toggle('error', isError);

  // Toggle loading state
  msgContainer.classList.toggle('loading', isLoading);
  msgContainer.classList.toggle('regular', !isLoading);
  overlay.classList.toggle('active', isLoading);

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
    showMessage(`No scheduling data available for ${path}`, true);
    return;
  }
  const scheduleList = existingSchedules.map((row) => `${row.command.split(' ')[0]}ing  ${row.when}`).join('\r\n');
  showMessage(`Schedules for ${path}:\r\n${scheduleList}`, false);
}

async function previewCronTab(url, opts, pagePath) {
  showMessage(`Please wait while updating and activating the schedules for ${pagePath}...`, false, true);

  const newOpts = { ...opts, method: 'POST' };
  const previewReqUrl = url.replace(DA_SOURCE, AEM_PREVIEW_REQUEST_URL).replace(CRON_TAB_PATH, `main/${CRON_TAB_PATH}`);

  try {
    const resp = await fetch(previewReqUrl, newOpts);
    if (!resp.ok) {
      showMessage('Failed to preview crontab file, please check the validity of cron expression', true);
    }
  } finally {
    // Remove loading state
    const msgContainer = document.querySelector('.message-wrapper');
    msgContainer.classList.remove('loading');
    msgContainer.classList.add('regular');
    overlay.classList.remove('active');
  }
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

  await previewCronTab(url, opts, pagePath);
  showExistingSchedules(pagePath, await getSchedules(url, opts));
}

// Move cron expression creation to a separate function
function createCronExpression(date, timezone) {
  // Convert to UTC if needed
  const utcDate = timezone === 'UTC' ? date : new Date(date.toLocaleString('en-US', { timeZone: timezone }));

  // Format time in 12-hour format with am/pm
  const timeFormatter = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
  const formattedTime = timeFormatter.format(utcDate);

  // Format date components
  const monthFormatter = new Intl.DateTimeFormat('en-US', { month: 'long' });
  const month = monthFormatter.format(utcDate);
  const day = utcDate.getUTCDate();
  const year = utcDate.getUTCFullYear();

  // Add ordinal suffix to day
  const ordinalSuffix = (d) => {
    if (d > 3 && d < 21) return 'th';
    switch (d % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  };

  return `at ${formattedTime} on the ${day}${ordinalSuffix(day)} day of ${month} in ${year}`;
}

/**
 * Initializes the scheduler interface
 * @returns {Promise<void>}
 */
async function init() {
  const { context, token } = await DA_SDK;

  const form = document.createElement('form');
  form.className = 'scheduler-form';
  form.setAttribute('role', 'form');
  form.setAttribute('aria-label', 'Schedule page publish/preview');

  // Create datetime container
  const datetimeContainer = document.createElement('div');
  datetimeContainer.className = 'datetime-container';
  datetimeContainer.setAttribute('role', 'group');
  datetimeContainer.setAttribute('aria-label', 'Date and time selection');

  // Create datetime row for Date and Time
  const datetimeRow = document.createElement('div');
  datetimeRow.className = 'datetime-row';

  // Create timezone row
  const timezoneRow = document.createElement('div');
  timezoneRow.className = 'timezone-row';

  // Create date picker
  const dateInput = document.createElement('input');
  dateInput.type = 'date';
  dateInput.id = 'scheduleDate';
  dateInput.className = 'schedule-input';
  dateInput.required = true;
  const [today] = new Date().toISOString().split('T'); // Today or later
  dateInput.min = today;
  dateInput.setAttribute('aria-required', 'true');
  dateInput.setAttribute('aria-label', 'Select date');

  // Create time picker
  const timeInput = document.createElement('input');
  timeInput.type = 'time';
  timeInput.id = 'scheduleTime';
  timeInput.className = 'schedule-input';
  timeInput.required = true;
  timeInput.setAttribute('aria-required', 'true');
  timeInput.setAttribute('aria-label', 'Select time');

  // Create timezone selector
  const timezoneSelect = document.createElement('select');
  timezoneSelect.id = 'scheduleTimezone';
  timezoneSelect.className = 'schedule-input';
  timezoneSelect.setAttribute('aria-label', 'Select timezone');

  // Get all timezone options
  const timeZones = Intl.supportedValuesOf('timeZone');

  // Get user's timezone
  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  // Function to get GMT offset for a timezone
  function getTimezoneOffset(timeZone) {
    const date = new Date();
    // Get offset in minutes
    const offset = -new Date(date.toLocaleString('en-US', { timeZone })).getTimezoneOffset();
    const hours = Math.floor(Math.abs(offset) / 60);
    const minutes = Math.abs(offset) % 60;
    const sign = offset >= 0 ? '+' : '-';

    return `(GMT${sign}${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')})`;
  }

  // Create timezone options with GMT offset
  timeZones.forEach((tz) => {
    const option = document.createElement('option');
    option.value = tz;
    const gmtOffset = getTimezoneOffset(tz);
    option.textContent = `${tz.replace(/_/g, ' ')} ${gmtOffset}`;

    // Set selected if it matches user's timezone
    if (tz === userTimezone) {
      option.selected = true;
    }

    timezoneSelect.appendChild(option);
  });

  // Sort options by GMT offset
  const sortedOptions = Array.from(timezoneSelect.options)
    .sort((a, b) => {
      const offsetA = getTimezoneOffset(a.value);
      const offsetB = getTimezoneOffset(b.value);
      return offsetA.localeCompare(offsetB);
    });

  // Clear and re-add sorted options
  timezoneSelect.innerHTML = '';
  sortedOptions.forEach((option) => timezoneSelect.appendChild(option));

  // Create labels
  const dateLabel = document.createElement('label');
  dateLabel.htmlFor = 'scheduleDate';
  dateLabel.textContent = 'Date';

  const timeLabel = document.createElement('label');
  timeLabel.htmlFor = 'scheduleTime';
  timeLabel.textContent = 'Time';

  const timezoneLabel = document.createElement('label');
  timezoneLabel.htmlFor = 'scheduleTimezone';
  timezoneLabel.textContent = 'Timezone';

  // Create input groups
  const dateGroup = document.createElement('div');
  dateGroup.className = 'input-group';
  dateGroup.appendChild(dateLabel);
  dateGroup.appendChild(dateInput);

  const timeGroup = document.createElement('div');
  timeGroup.className = 'input-group';
  timeGroup.appendChild(timeLabel);
  timeGroup.appendChild(timeInput);

  const timezoneGroup = document.createElement('div');
  timezoneGroup.className = 'input-group';
  timezoneGroup.appendChild(timezoneLabel);
  timezoneGroup.appendChild(timezoneSelect);

  // Add Date and Time to first row
  datetimeRow.append(dateGroup, timeGroup);

  // Add Timezone to second row
  timezoneRow.appendChild(timezoneGroup);

  // Add both rows to container
  datetimeContainer.append(datetimeRow, timezoneRow);

  // Add to form
  form.appendChild(datetimeContainer);

  // Update form submission handler
  form.addEventListener('submit', (e) => {
    e.preventDefault();
  });

  // Create and style the form container
  const formContainer = document.createElement('div');
  formContainer.className = 'scheduler-form-wrapper';

  const msgContainer = document.createElement('div');
  msgContainer.className = 'message-wrapper hidden';
  msgContainer.setAttribute('role', 'alert');
  msgContainer.setAttribute('aria-live', 'polite');

  const message = document.createElement('div');
  message.className = 'feedback-message';
  message.textContent = '';
  msgContainer.append(message);

  // Create button group container
  const buttonGroup = document.createElement('div');
  buttonGroup.className = 'button-group';
  buttonGroup.setAttribute('role', 'group');
  buttonGroup.setAttribute('aria-label', 'Form actions');

  // Create preview button
  const schedulePreviewBtn = document.createElement('button');
  schedulePreviewBtn.className = 'schedule-btn';
  schedulePreviewBtn.textContent = 'Preview';
  schedulePreviewBtn.type = 'submit';
  schedulePreviewBtn.setAttribute('aria-label', 'Schedule preview');

  // Create publish button
  const schedulePublishBtn = document.createElement('button');
  schedulePublishBtn.className = 'schedule-btn';
  schedulePublishBtn.textContent = 'Publish';
  schedulePublishBtn.type = 'submit';
  schedulePublishBtn.setAttribute('aria-label', 'Schedule publish');

  // Create reset button
  const resetBtn = document.createElement('button');
  resetBtn.className = 'schedule-btn';
  resetBtn.textContent = 'Reset';
  resetBtn.type = 'reset';
  resetBtn.setAttribute('aria-label', 'Reset form');
  // Add all buttons to button group
  buttonGroup.append(schedulePreviewBtn, schedulePublishBtn, resetBtn);

  // Assemble the form
  form.append(buttonGroup);
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
  schedulePublishBtn.addEventListener('click', async () => {
    if (!dateInput.value || !timeInput.value) {
      showMessage('Please select both date and time', true);
      return;
    }
    const date = new Date(`${dateInput.value}T${timeInput.value}`);
    const expression = createCronExpression(date, timezoneSelect.value);
    await processCommand(url, opts, 'publish', context.path, expression);
  });

  schedulePreviewBtn.addEventListener('click', async () => {
    if (!dateInput.value || !timeInput.value) {
      showMessage('Please select both date and time', true);
      return;
    }
    const date = new Date(`${dateInput.value}T${timeInput.value}`);
    const expression = createCronExpression(date, timezoneSelect.value);
    await processCommand(url, opts, 'preview', context.path, expression);
  });

  // Add form reset handler
  resetBtn.addEventListener('click', () => {
    dateInput.value = '';
    timeInput.value = '';
    timezoneSelect.value = userTimezone;
  });
}

init();
