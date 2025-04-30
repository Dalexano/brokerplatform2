import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

export async function createPDF(data) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage();
  const { width, height } = page.getSize();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  page.drawText('Marketing Agreement Summary', {
    x: 50,
    y: height - 50,
    size: 20,
    font,
    color: rgb(0, 0, 0),
  });

  let y = height - 100;
  for (const [key, value] of Object.entries(data)) {
    page.drawText(`${key}: ${value}`, {
      x: 50,
      y,
      size: 12,
      font,
      color: rgb(0.2, 0.2, 0.2),
    });
    y -= 20;
  }

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}
