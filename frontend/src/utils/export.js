// Export utility functions for poll results

/**
 * Export poll data to CSV
 */
export const exportPollToCSV = (poll, options) => {
  const totalVotes = options.reduce((sum, opt) => sum + opt.votes_count, 0);
  
  // Create CSV content
  let csv = `Poll: ${poll.title}\n`;
  csv += `Beskrivelse: ${poll.description || 'Ingen beskrivelse'}\n`;
  csv += `Lokasjon: ${poll.location_type === 'by' ? poll.location_name : 'Hele landet'}\n`;
  csv += `Kategori: ${poll.category || 'Ingen kategori'}\n`;
  csv += `Totalt antall stemmer: ${totalVotes}\n`;
  csv += `Opprettet: ${new Date(poll.created_at).toLocaleString('no-NO')}\n\n`;
  
  csv += `Alternativ,Stemmer,Prosent\n`;
  
  options.forEach(option => {
    const percentage = totalVotes > 0 ? ((option.votes_count / totalVotes) * 100).toFixed(2) : '0.00';
    csv += `"${option.option_text}",${option.votes_count},${percentage}%\n`;
  });
  
  // Create blob and download
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `poll_${poll.id}_${poll.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  window.showToast?.('Poll eksportert som CSV!', 'success');
};

/**
 * Export poll data to PDF (HTML-based PDF using print)
 * Falls back to formatted text file if print is not available
 */
export const exportPollToPDF = async (poll, options) => {
  const totalVotes = options.reduce((sum, opt) => sum + opt.votes_count, 0);
  
  // Create HTML content for PDF
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="no">
    <head>
      <meta charset="UTF-8">
      <title>Poll Resultater - ${poll.title}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          padding: 20px;
          max-width: 800px;
          margin: 0 auto;
        }
        h1 {
          color: #333;
          border-bottom: 2px solid #333;
          padding-bottom: 10px;
        }
        .poll-info {
          margin: 20px 0;
          padding: 15px;
          background-color: #f5f5f5;
          border-radius: 5px;
        }
        .poll-info p {
          margin: 5px 0;
        }
        .results {
          margin-top: 30px;
        }
        .result-item {
          margin: 15px 0;
          padding: 10px;
          border-left: 4px solid #007bff;
        }
        .result-item h3 {
          margin: 0 0 10px 0;
          color: #333;
        }
        .result-stats {
          font-size: 14px;
          color: #666;
        }
        @media print {
          body {
            padding: 0;
          }
        }
      </style>
    </head>
    <body>
      <h1>${poll.title}</h1>
      <div class="poll-info">
        <p><strong>Beskrivelse:</strong> ${poll.description || 'Ingen beskrivelse'}</p>
        <p><strong>Lokasjon:</strong> ${poll.location_type === 'by' ? poll.location_name : 'Hele landet'}</p>
        <p><strong>Kategori:</strong> ${poll.category || 'Ingen kategori'}</p>
        <p><strong>Totalt antall stemmer:</strong> ${totalVotes}</p>
        <p><strong>Opprettet:</strong> ${new Date(poll.created_at).toLocaleString('no-NO')}</p>
      </div>
      <div class="results">
        <h2>Resultater</h2>
        ${options.map((option, index) => {
          const percentage = totalVotes > 0 ? ((option.votes_count / totalVotes) * 100).toFixed(2) : '0.00';
          return `
            <div class="result-item">
              <h3>${index + 1}. ${option.option_text}</h3>
              <div class="result-stats">
                Stemmer: ${option.votes_count} (${percentage}%)
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </body>
    </html>
  `;
  
  // Try to use print dialog for PDF
  try {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    // Wait for content to load, then trigger print
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print();
        window.showToast?.('Bruk print-dialogen for å lagre som PDF!', 'info');
      }, 250);
    };
  } catch (error) {
    // Fallback: Create formatted text file
    console.error('Print error:', error);
    const text = generatePollTextReport(poll, options);
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `poll_${poll.id}_${poll.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.showToast?.('Poll eksportert som tekstfil!', 'info');
  }
};

/**
 * Generate simple text report (fallback)
 */
const generatePollTextReport = (poll, options) => {
  const totalVotes = options.reduce((sum, opt) => sum + opt.votes_count, 0);
  
  let text = `POLL RESULTATER\n`;
  text += `================\n\n`;
  text += `Tittel: ${poll.title}\n`;
  text += `Beskrivelse: ${poll.description || 'Ingen beskrivelse'}\n`;
  text += `Lokasjon: ${poll.location_type === 'by' ? poll.location_name : 'Hele landet'}\n`;
  text += `Kategori: ${poll.category || 'Ingen kategori'}\n`;
  text += `Totalt antall stemmer: ${totalVotes}\n`;
  text += `Opprettet: ${new Date(poll.created_at).toLocaleString('no-NO')}\n\n`;
  text += `RESULTATER:\n`;
  text += `-----------\n\n`;
  
  options.forEach((option, index) => {
    const percentage = totalVotes > 0 ? ((option.votes_count / totalVotes) * 100).toFixed(2) : '0.00';
    text += `${index + 1}. ${option.option_text}\n`;
    text += `   Stemmer: ${option.votes_count} (${percentage}%)\n\n`;
  });
  
  return text;
};

/**
 * Export poll results (tries PDF first, falls back to CSV)
 */
export const exportPollResults = async (poll, options, format = 'csv') => {
  if (format === 'pdf') {
    await exportPollToPDF(poll, options);
  } else {
    exportPollToCSV(poll, options);
  }
};

