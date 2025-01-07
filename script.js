function updateSizeLabel() {
    const sizeInput = document.getElementById('sizeInput');
    const sizeLabel = document.getElementById('sizeLabel');
    sizeLabel.textContent = `${sizeInput.value}px`;
}

function generateQRCode() {
    const url = document.getElementById('urlInput').value;
    const size = parseInt(document.getElementById('sizeInput').value);
    const color = document.getElementById('colorPicker').value;
    const logoFile = document.getElementById('logoInput').files[0];
    const canvas = document.getElementById('qrCanvas');
    const ctx = canvas.getContext('2d');
    const downloadLink = document.getElementById('downloadLink');

    if (!url.trim()) {
        alert('Please enter a URL');
        return;
    }

    // Generate QR code
    const qr = qrcode(0, 'L'); // Low error correction level
    qr.addData(url);
    qr.make();

    canvas.width = size;
    canvas.height = size;

    const cellSize = size / qr.getModuleCount();
    ctx.clearRect(0, 0, size, size);

    for (let row = 0; row < qr.getModuleCount(); row++) {
        for (let col = 0; col < qr.getModuleCount(); col++) {
            ctx.fillStyle = qr.isDark(row, col) ? color : '#fff';
            ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
        }
    }

    // Add logo if provided
    if (logoFile) {
        const logoImage = new Image();
        logoImage.src = URL.createObjectURL(logoFile);
        logoImage.onload = () => {
            const logoSize = size / 5; // Set logo size to 1/5 of the QR code size
            const logoX = (size - logoSize) / 2; // Center logo horizontally
            const logoY = (size - logoSize) / 2; // Center logo vertically

            // Draw the logo
            ctx.drawImage(logoImage, logoX, logoY, logoSize, logoSize);

            // Prepare download link
            downloadLink.style.display = 'inline-block';
            downloadLink.href = canvas.toDataURL('image/png');
        };

        logoImage.onerror = () => {
            alert('Failed to load logo image. Please try again.');
        };
    } else {
        // Prepare download link if no logo is added
        downloadLink.style.display = 'inline-block';
        downloadLink.href = canvas.toDataURL('image/png');
    }
}
