(() => {
  const setCopiedState = (button, feedback, copied) => {
    const successLabel = button.dataset.copySuccessLabel || 'Zkopírováno';
    button.textContent = copied ? successLabel : (button.dataset.copyLabel || 'Kopírovat prompt');
    button.classList.toggle('copied', copied);
    if (feedback) feedback.textContent = copied ? successLabel : '';
  };
  const fallbackCopy = (value) => {
    const textarea = document.createElement('textarea');
    textarea.value = value;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    const copied = document.execCommand('copy');
    textarea.remove();
    return copied;
  };
  document.addEventListener('click', async (event) => {
    const button = event.target.closest('[data-copy-prompt]');
    if (!button) return;
    const prompt = document.getElementById(button.dataset.copyPrompt);
    const feedback = button.closest('.prompt-card')?.querySelector('.prompt-copy-feedback');
    const value = (button.dataset.copyFormat === 'rendered' ? prompt?.innerText : prompt?.textContent)?.trim();
    if (!value) {
      if (feedback) feedback.textContent = 'Prompt nenalezen – označte text ručně.';
      return;
    }
    try {
      if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(value);
      else if (!fallbackCopy(value)) throw new Error('Copy command failed');
      setCopiedState(button, feedback, true);
      window.clearTimeout(button._copyTimer);
      button._copyTimer = window.setTimeout(() => setCopiedState(button, feedback, false), 2200);
    } catch {
      setCopiedState(button, feedback, false);
      if (feedback) feedback.textContent = 'Kopírování selhalo – označte text ručně.';
    }
  });
})();
