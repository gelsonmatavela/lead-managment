import pluralize from 'pluralize';
import * as XLSX from 'xlsx';

/**
 * Downloads a csv file containing the passed data
 * @param {Record<string, any>} data
 * @param {String} filename
 * @returns {void}
 *
 * #### Usage example:
 *
 * ```javascript
 * const data = [
 *   {name: 'John', age: 30},
 *   {name: 'Jane', age: 25}
 * ];
 * downloadCSV(data, 'people.csv');
 * ```
 *
 */
export function downloadCSV(data: Record<string, any>[], name: string) {
  if (!data || data.length === 0) {
    alert('No data to export');
    return;
  }
  const headers = Object.keys(data[0]);

  // Compute totals
  const totals = headers.reduce((acc, field) => {
    const sum = data.reduce((total, row) => {
      const value = row[field];
      return total + (isNaN(value) ? 0 : Number(value));
    }, 0);

    if (field == 'N°') acc[field] = 'Total';
    else acc[field] = isNaN(data[0][field]) ? ' ' : sum.toFixed(2);
    return acc;
  }, {} as Record<string, any>);

  // Create CSV content
  const xlsxContent = [
    headers.join(','),
    ...data.map((row) => headers.map((field) => row[field].replace(/,/g, ' ')).join(',')),
    headers.map((field) => totals[field]).join(','),
  ].join('\n');

  const xlsx = convertToXLSX(
    xlsxContent,
    `${pluralize(name.toUpperCase())} (${new Date().toUTCString()})`
  );

  const link = document.createElement('a');
  link.href = URL.createObjectURL(xlsx);
  link.download = `${pluralize(name.toUpperCase())} (${new Date().toUTCString()}).xlsx`;
  link.click();
}

export function generateCSVContent(data: Record<string, any>[]) {
  const headers = Object.keys(data[0]);
  const csvContent =
    'data:text/csv;charset=utf-8,' +
    [headers.join(','), ...data.map((row) => headers.map((field) => row[field]).join(','))].join(
      '\n'
    );
  return csvContent;
}

const convertToXLSX = (csvContent: string, title: string) => {
  // Parse CSV content to array of arrays
  const rows = csvContent.split('\n').map((row) => row.split(','));

  // Get the number of columns from the first data row
  const numColumns = rows[0].length;

  // Create title row with empty cells matching the number of columns
  const titleRow = ['    ', ...Array(numColumns - 1).fill('')];
  const mergedRows = [titleRow, ...rows];

  // Function to calculate text width (approximate)
  const getTextWidth = (text: string): number => {
    const weights = {
      default: 1.0,
      wide: 1.5,
      narrow: 0.7,
    };

    return text.split('').reduce((width, char) => {
      if ('WMwm'.includes(char)) return width + weights.wide;
      if ('il1'.includes(char)) return width + weights.narrow;
      return width + weights.default;
    }, 0);
  };

  // Calculate column widths based on content
  const columnWidths = Array(numColumns)
    .fill(0)
    .map((_, colIndex) => {
      const maxWidth = Math.max(
        ...mergedRows.map((row) => {
          const cellContent = row[colIndex]?.toString() || '';
          return getTextWidth(cellContent.trim());
        })
      );
      return { wch: Math.max(10, Math.ceil(maxWidth * 1.2)) };
    });

  // Calculate row heights based on content
  const rowHeights = mergedRows.map((row, rowIndex) => {
    // Make title row slightly taller
    if (rowIndex === 0) {
      return { hpt: 30 }; // Increased height for title row
    }

    const maxLines = Math.max(
      ...row.map((cell) => {
        const cellContent = cell?.toString() || '';
        const lines = cellContent.split('\n').length;
        const estimatedWrappedLines = Math.ceil(getTextWidth(cellContent) / 50);
        return Math.max(lines, estimatedWrappedLines);
      })
    );
    return { hpt: Math.max(20, maxLines * 20) };
  });

  // Create workbook
  const workbook = XLSX.utils.book_new();

  // Convert array to worksheet
  const worksheet = XLSX.utils.aoa_to_sheet(mergedRows);

  // Add merge cells for title across all columns
  worksheet['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: numColumns - 1 } }];

  // Apply calculated dimensions
  worksheet['!cols'] = columnWidths;
  worksheet['!rows'] = rowHeights;

  // Add cell styles for title
  worksheet['A1'] = {
    v: title,
    t: 's',
    s: {
      font: {
        bold: true,
        sz: 16, // Increased font size for title (regular text is usually 11)
      },
      alignment: {
        horizontal: 'center',
        vertical: 'center',
        wrapText: true,
      },
    },
  };

  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

  // Generate XLSX file
  const wbout = XLSX.write(workbook, {
    bookType: 'xlsx',
    type: 'binary',
    cellStyles: true,
  });

  // Convert string to ArrayBuffer
  const s2ab = (s: string) => {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i < s.length; i++) {
      view[i] = s.charCodeAt(i) & 0xff;
    }
    return buf;
  };

  // Create blob and trigger download
  const blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' });

  return blob;
};
