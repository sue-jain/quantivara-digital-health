'use strict';
const form = document.getElementById('demo-form');
const result = document.getElementById('form-result');
const copyStatus = document.getElementById('copy-status');
let requestText = '';

form.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  const data = new FormData(form);
  const value = (key) => String(data.get(key) || '').trim();
  const subject = 'Santhica demo request — ' + (value('organisation') || value('name'));
  const body = [
    'Hello Santhica team,', '', 'I would like to arrange a demo.', '',
    'Name: ' + value('name'),
    'Email: ' + value('email'),
    'Organisation: ' + (value('organisation') || 'Not provided'),
    'Care setting: ' + value('type'), '',
    'What I would like to explore:', value('message') || 'A walkthrough of Santhica.',
  ].join('\n');
  document.getElementById('email-draft').href = 'mailto:support@santhica.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
  requestText = 'To: support@santhica.com\nSubject: ' + subject + '\n\n' + body;
  result.hidden = false;
  copyStatus.textContent = '';
  result.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'nearest' });
});

// Drafts are local only. Editing the form invalidates the previously prepared draft.
form.addEventListener('input', () => { result.hidden = true; });
document.getElementById('copy-request').addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(requestText);
    copyStatus.textContent = 'Copied. Paste this request into an email to support@santhica.com.';
  } catch {
    copyStatus.textContent = 'Copy is unavailable here. Use “Open email draft” or email support@santhica.com directly.';
  }
});



