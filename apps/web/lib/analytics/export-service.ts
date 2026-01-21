import type { ExportOptions } from '@/types/analytics';
import * as XLSX from 'xlsx';

/**
 * Analytics Export Service
 * Handles PDF, CSV, and Excel exports
 */
export class AnalyticsExportService {
  /**
   * Export analytics data to PDF
   * Uses jsPDF for PDF generation
   */
  async exportToPDF(data: any, options: ExportOptions): Promise<void> {
    // Dynamically import jsPDF to avoid SSR issues
    const { jsPDF } = await import('jspdf');

    const doc = new jsPDF();
    const timestamp = new Date().toLocaleDateString('pt-BR');

    // Add title
    doc.setFontSize(20);
    doc.text('Relatório de Analytics', 20, 20);

    doc.setFontSize(12);
    doc.text(`Período: ${options.period || 'Último mês'}`, 20, 30);
    doc.text(`Data de exportação: ${timestamp}`, 20, 38);

    let yOffset = 55;

    // Add overview data if available
    if (data.overview) {
      doc.setFontSize(14);
      doc.text('Visão Geral', 20, yOffset);
      yOffset += 10;

      doc.setFontSize(10);
      const overview = data.overview;
      if (overview.totalVoters) {
        doc.text(`Total de Eleitores: ${overview.totalVoters}`, 25, yOffset);
        yOffset += 7;
      }
      if (overview.totalEvents) {
        doc.text(`Total de Eventos: ${overview.totalEvents}`, 25, yOffset);
        yOffset += 7;
      }
      if (overview.activeVolunteers) {
        doc.text(`Voluntários Ativos: ${overview.activeVolunteers}`, 25, yOffset);
        yOffset += 7;
      }
      yOffset += 10;
    }

    // Add voters data summary if available
    if (data.voters) {
      doc.setFontSize(14);
      doc.text('Análise de Eleitores', 20, yOffset);
      yOffset += 10;

      doc.setFontSize(10);
      if (data.voters.total) {
        doc.text(`Total: ${data.voters.total}`, 25, yOffset);
        yOffset += 7;
      }
      if (data.voters.newThisPeriod) {
        doc.text(`Novos no Período: ${data.voters.newThisPeriod}`, 25, yOffset);
        yOffset += 7;
      }
      yOffset += 10;
    }

    // Save the PDF
    doc.save(`analytics-report-${Date.now()}.pdf`);
  }

  /**
   * Export data to CSV
   */
  async exportToCSV(data: any[], filename: string): Promise<void> {
    if (!data || data.length === 0) {
      throw new Error('No data to export');
    }

    const csv = this.convertToCSV(data);
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' }); // BOM for Excel
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}-${Date.now()}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  /**
   * Export data to Excel using xlsx
   */
  async exportToExcel(data: any, filename: string): Promise<void> {
    const workbook = XLSX.utils.book_new();

    // Overview sheet
    if (data.overview) {
      const overviewData = this.flattenObject(data.overview, 'Visão Geral');
      const ws1 = XLSX.utils.json_to_sheet(overviewData);
      XLSX.utils.book_append_sheet(workbook, ws1, 'Visão Geral');
    }

    // Voters sheet
    if (data.voters) {
      const votersData = this.flattenObject(data.voters, 'Eleitores');
      const ws2 = XLSX.utils.json_to_sheet(votersData);
      XLSX.utils.book_append_sheet(workbook, ws2, 'Eleitores');
    }

    // Events sheet
    if (data.events) {
      const eventsData = this.flattenObject(data.events, 'Eventos');
      const ws3 = XLSX.utils.json_to_sheet(eventsData);
      XLSX.utils.book_append_sheet(workbook, ws3, 'Eventos');
    }

    // Geographic sheet
    if (data.geographic?.regions) {
      const ws4 = XLSX.utils.json_to_sheet(data.geographic.regions);
      XLSX.utils.book_append_sheet(workbook, ws4, 'Regiões');
    }

    // Top Influencers sheet
    if (data.influence?.topInfluencers) {
      const ws5 = XLSX.utils.json_to_sheet(data.influence.topInfluencers);
      XLSX.utils.book_append_sheet(workbook, ws5, 'Top Influenciadores');
    }

    // Top Engaged sheet
    if (data.engagement?.topEngaged) {
      const ws6 = XLSX.utils.json_to_sheet(data.engagement.topEngaged);
      XLSX.utils.book_append_sheet(workbook, ws6, 'Top Engajados');
    }

    // Canvassing sheet
    if (data.canvassing) {
      const canvassingData = this.flattenObject(data.canvassing, 'Corpo a Corpo');
      const ws7 = XLSX.utils.json_to_sheet(canvassingData);
      XLSX.utils.book_append_sheet(workbook, ws7, 'Corpo a Corpo');
    }

    // Write and download
    XLSX.writeFile(workbook, `${filename}-${Date.now()}.xlsx`);
  }

  /**
   * Convert array of objects to CSV string
   */
  private convertToCSV(data: any[]): string {
    if (!data.length) return '';

    const headers = Object.keys(data[0]);
    const csvRows = [headers.join(',')];

    for (const row of data) {
      const values = headers.map((header) => {
        const value = row[header];
        if (value === null || value === undefined) return '';
        // Escape quotes and wrap in quotes if contains comma or newline
        const escaped = String(value).replace(/"/g, '""');
        return escaped.includes(',') || escaped.includes('\n') ? `"${escaped}"` : escaped;
      });
      csvRows.push(values.join(','));
    }

    return csvRows.join('\n');
  }

  /**
   * Flatten an object into array of {key, value} for Excel export
   */
  private flattenObject(obj: any, prefix: string = ''): Array<{ Métrica: string, Valor: any }> {
    const result: Array<{ Métrica: string, Valor: any }> = [];

    for (const [key, value] of Object.entries(obj)) {
      if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
        // Recursively flatten nested objects
        const nested = this.flattenObject(value, key);
        result.push(...nested);
      } else if (!Array.isArray(value)) {
        // Format key for display
        const displayKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
        result.push({ Métrica: displayKey, Valor: value });
      }
    }

    return result;
  }
}
