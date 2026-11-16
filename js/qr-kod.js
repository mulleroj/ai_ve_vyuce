(function () {
  'use strict';

  const form = document.getElementById('qrForm');
  const input = document.getElementById('urlInput');
  const container = document.getElementById('qrCode');
  const downloadButton = document.getElementById('downloadQr');
  const clearButton = document.getElementById('clearQr');
  const error = document.getElementById('qrError');
  const status = document.getElementById('qrStatus');
  const textOption = document.getElementById('qrTextOption');
  const imageOption = document.getElementById('qrImageOption');
  const textInput = document.getElementById('qrText');
  const imageInput = document.getElementById('qrImage');

  if (!form || !input || !container || !downloadButton || !clearButton || !error || !status) {
    return;
  }

  let generatedUrl = '';
  let overlayImage = null;
  const qrSource = document.createElement('div');
  qrSource.setAttribute('aria-hidden', 'true');
  qrSource.style.position = 'absolute';
  qrSource.style.left = '-10000px';
  qrSource.style.top = '0';
  document.body.appendChild(qrSource);

  function setError(message) {
    error.textContent = message;
  }

  function setRenderError(message) {
    container.replaceChildren();
    qrSource.replaceChildren();
    downloadButton.disabled = true;
    status.textContent = 'QR kód nebyl vytvořen. Zadaná adresa zůstává ve formuláři.';
    setError(message);
  }

  function normalizeUrl(value) {
    const trimmed = value.trim();
    if (!trimmed) {
      throw new Error('Zadejte prosím webovou adresu.');
    }

    const candidate = /^[a-z][a-z\d+.-]*:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
    let parsed;

    try {
      parsed = new URL(candidate);
    } catch (e) {
      throw new Error('Adresa nemá platný formát. Zkontrolujte ji a zkuste to znovu.');
    }

    if (!['http:', 'https:'].includes(parsed.protocol) || !parsed.hostname) {
      throw new Error('Použijte odkaz začínající http:// nebo https://.');
    }

    return parsed.href;
  }

  function clearResult() {
    container.replaceChildren();
    qrSource.replaceChildren();
    generatedUrl = '';
    downloadButton.disabled = true;
    status.textContent = 'Po zadání adresy se zde zobrazí váš QR kód.';
    setError('');
  }

  function getOverlayType() {
    const selected = document.querySelector('input[name="overlayType"]:checked');
    return selected ? selected.value : 'none';
  }

  function updateOverlayOptions() {
    const type = getOverlayType();
    textOption.hidden = type !== 'text';
    imageOption.hidden = type !== 'image';
  }

  function getQrImage() {
    return container.querySelector('canvas');
  }

  function drawRoundedRect(context, x, y, width, height, radius) {
    const safeRadius = Math.min(radius, width / 2, height / 2);
    context.beginPath();
    context.moveTo(x + safeRadius, y);
    context.arcTo(x + width, y, x + width, y + height, safeRadius);
    context.arcTo(x + width, y + height, x, y + height, safeRadius);
    context.arcTo(x, y + height, x, y, safeRadius);
    context.arcTo(x, y, x + width, y, safeRadius);
    context.closePath();
  }

  function drawTextOverlay(context, size, value) {
    const text = value.trim();
    let fontSize = 24;
    const maxWidth = 135;
    let metrics;

    do {
      context.font = `700 ${fontSize}px Outfit, Arial, sans-serif`;
      metrics = context.measureText(text);
      if (metrics.width <= maxWidth || fontSize <= 12) {
        break;
      }
      fontSize -= 1;
    } while (fontSize > 12);

    const boxWidth = Math.min(maxWidth + 20, Math.max(86, metrics.width + 20));
    const boxHeight = fontSize + 22;
    const x = (size - boxWidth) / 2;
    const y = (size - boxHeight) / 2;

    context.save();
    context.fillStyle = '#ffffff';
    context.shadowColor = 'rgba(10, 15, 30, 0.22)';
    context.shadowBlur = 8;
    drawRoundedRect(context, x, y, boxWidth, boxHeight, 10);
    context.fill();
    context.shadowColor = 'transparent';
    context.strokeStyle = '#00a98a';
    context.lineWidth = 3;
    drawRoundedRect(context, x, y, boxWidth, boxHeight, 10);
    context.stroke();
    context.fillStyle = '#0a0f1e';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(text, size / 2, size / 2 + 1);
    context.restore();
  }

  function drawImageOverlay(context, size, image) {
    const boxSize = 112;
    const imageSize = 78;
    const x = (size - boxSize) / 2;
    const y = (size - boxSize) / 2;

    context.save();
    context.fillStyle = '#ffffff';
    context.shadowColor = 'rgba(10, 15, 30, 0.22)';
    context.shadowBlur = 8;
    drawRoundedRect(context, x, y, boxSize, boxSize, 14);
    context.fill();
    context.shadowColor = 'transparent';
    context.strokeStyle = '#00a98a';
    context.lineWidth = 3;
    drawRoundedRect(context, x, y, boxSize, boxSize, 14);
    context.stroke();
    context.drawImage(image, x + (boxSize - imageSize) / 2, y + (boxSize - imageSize) / 2, imageSize, imageSize);
    context.restore();
  }

  function getOverlay() {
    const type = getOverlayType();
    if (type === 'text') {
      const text = textInput.value.trim();
      if (!text) {
        throw new Error('Zadejte krátký nápis, nebo zvolte Bez doplňku.');
      }
      return { type, value: text };
    }

    if (type === 'image') {
      if (!overlayImage) {
        throw new Error('Vyberte obrázek, nebo zvolte Bez doplňku.');
      }
      return { type, value: overlayImage };
    }

    return { type: 'none' };
  }

  function renderQr() {
    setError('');
    container.replaceChildren();
    qrSource.replaceChildren();
    downloadButton.disabled = true;
    status.textContent = 'QR kód se připravuje…';
    let overlay;
    try {
      overlay = getOverlay();
    } catch (overlayError) {
      setRenderError(overlayError.message);
      return;
    }

    if (typeof window.QRCode !== 'function') {
      setRenderError('Generátor QR kódu se právě nenačetl. Zkontrolujte připojení a zkuste to znovu.');
      return;
    }

    const size = 320;
    try {
      new window.QRCode(qrSource, {
        text: generatedUrl,
        width: size,
        height: size,
        colorDark: '#0a0f1e',
        colorLight: '#ffffff',
        correctLevel: window.QRCode.CorrectLevel.H
      });

      const sourceImage = qrSource.querySelector('canvas, img');
      if (!sourceImage) {
        setRenderError('QR kód se nepodařilo vykreslit. Zkuste to prosím znovu.');
        return;
      }

      const output = document.createElement('canvas');
      output.width = size;
      output.height = size;
      output.setAttribute('role', 'img');
      output.setAttribute('aria-label', 'Vygenerovaný QR kód');
      const context = output.getContext('2d');
      if (!context) {
        setRenderError('Prohlížeč nemůže připravit obrázek QR kódu.');
        return;
      }

      const draw = function () {
        try {
          context.drawImage(sourceImage, 0, 0, size, size);
          if (overlay.type === 'text') {
            drawTextOverlay(context, size, overlay.value);
          } else if (overlay.type === 'image') {
            drawImageOverlay(context, size, overlay.value);
          }
          container.replaceChildren(output);
          downloadButton.disabled = false;
          const overlayLabel = overlay.type === 'none' ? '' : overlay.type === 'text' ? ' s nápisem' : ' s obrázkem';
          const success = document.createElement('strong');
          success.textContent = `QR kód${overlayLabel} je připraven.`;
          status.replaceChildren(success, document.createElement('br'), document.createTextNode(generatedUrl));
          setError('');
        } catch (drawError) {
          setRenderError('QR kód se nepodařilo vykreslit. Zkuste to prosím znovu.');
        }
      };

      if (sourceImage.tagName.toLowerCase() === 'img' && !sourceImage.complete) {
        sourceImage.addEventListener('load', draw, { once: true });
        sourceImage.addEventListener('error', function () {
          setRenderError('QR kód se nepodařilo načíst. Zkuste to prosím znovu.');
        }, { once: true });
      } else if (sourceImage.tagName.toLowerCase() === 'img' && !sourceImage.naturalWidth) {
        setRenderError('QR kód se nepodařilo načíst. Zkuste to prosím znovu.');
      } else {
        draw();
      }
    } catch (renderError) {
      setRenderError('Generátor QR kódu selhal. Zadaná adresa zůstává ve formuláři.');
    }
  }

  function downloadQrCode() {
    const image = getQrImage();
    if (!image || !generatedUrl) {
      return;
    }

    try {
      const dataUrl = image.toDataURL('image/png');
      if (!dataUrl || !dataUrl.startsWith('data:image/png')) {
        throw new Error('PNG data URL unavailable');
      }

      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = 'qr-kod.png';
      document.body.appendChild(link);
      link.click();
      link.remove();
      setError('');
    } catch (downloadError) {
      setError('QR kód se nepodařilo připravit ke stažení.');
    }
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    setError('');

    let normalizedUrl;
    try {
      normalizedUrl = normalizeUrl(input.value);
    } catch (validationError) {
      clearResult();
      setError(validationError.message);
      input.focus();
      return;
    }

    generatedUrl = normalizedUrl;
    renderQr();
  });

  clearButton.addEventListener('click', function () {
    input.value = '';
    textInput.value = '';
    imageInput.value = '';
    overlayImage = null;
    const noneOption = document.querySelector('input[name="overlayType"][value="none"]');
    if (noneOption) {
      noneOption.checked = true;
    }
    updateOverlayOptions();
    clearResult();
    input.focus();
  });

  document.querySelectorAll('input[name="overlayType"]').forEach(function (radio) {
    radio.addEventListener('change', function () {
      updateOverlayOptions();
      if (generatedUrl) {
        renderQr();
      }
    });
  });

  textInput.addEventListener('input', function () {
    if (generatedUrl && getOverlayType() === 'text') {
      renderQr();
    }
  });

  imageInput.addEventListener('change', function () {
    const file = imageInput.files && imageInput.files[0];
    if (!file) {
      overlayImage = null;
      return;
    }

    const reader = new FileReader();
    reader.addEventListener('load', function () {
      const image = new Image();
      image.addEventListener('load', function () {
        overlayImage = image;
        if (generatedUrl && getOverlayType() === 'image') {
          renderQr();
        }
      }, { once: true });
      image.src = reader.result;
    }, { once: true });
    reader.readAsDataURL(file);
  });

  updateOverlayOptions();
  downloadButton.addEventListener('click', downloadQrCode);
}());
