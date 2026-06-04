const PDFDocument = require('pdfkit');

function generateReport(data) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 });
    const chunks = [];

    doc.on('data', chunk => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    // header
    doc.fontSize(22).font('Helvetica-Bold').text('Pulse — Sentiment Report', { align: 'center' });
    doc.moveDown(0.5);
    doc.fontSize(11).font('Helvetica').fillColor('#555')
      .text(`Generated: ${new Date().toUTCString()}`, { align: 'center' });
    doc.moveDown(1);

    // company + survey info
    doc.fontSize(13).font('Helvetica-Bold').fillColor('#000').text('Survey Summary');
    doc.moveDown(0.3);
    doc.fontSize(11).font('Helvetica')
      .text(`Company: ${data.companyName || 'N/A'}`)
      .text(`Survey: ${data.surveyTitle || 'N/A'}`)
      .text(`Total Responses: ${data.responseCount ?? 0}`);
    doc.moveDown(1);

    // department breakdown
    if (data.departmentScores && data.departmentScores.length > 0) {
      doc.fontSize(13).font('Helvetica-Bold').text('Average Sentiment by Department');
      doc.moveDown(0.3);

      data.departmentScores.forEach(({ department, avgScore }) => {
        const pct = ((avgScore || 0) * 100).toFixed(1);
        const label = avgScore >= 0.6 ? 'Positive' : avgScore >= 0.4 ? 'Neutral' : 'Negative';
        doc.fontSize(11).font('Helvetica').text(`  ${department}: ${pct}%  (${label})`);
      });
      doc.moveDown(1);
    }

    // week-by-week trend
    if (data.trends && data.trends.length > 0) {
      doc.fontSize(13).font('Helvetica-Bold').text('Week-by-Week Sentiment Trend');
      doc.moveDown(0.3);

      data.trends.forEach(({ week, avgScore }) => {
        const pct = ((avgScore || 0) * 100).toFixed(1);
        doc.fontSize(11).font('Helvetica').text(`  Week ${week}: ${pct}%`);
      });
    }

    doc.end();
  });
}

module.exports = { generateReport };
