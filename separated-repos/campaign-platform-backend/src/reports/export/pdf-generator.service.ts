import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import * as Handlebars from 'handlebars';
import * as fs from 'fs/promises';
import * as path from 'path';

export interface PdfGenerationOptions {
  reportName: string;
  description?: string;
  data: any[];
  columns: string[];
  summary?: {
    total: number;
    supportLevel?: Record<string, number>;
    cityBreakdown?: Record<string, number>;
  };
  generatedBy: string;
  footerNote?: string;
}

/**
 * PDF Generator Service
 *
 * Generates PDF reports using Puppeteer and Handlebars templates.
 * Uses HTML/CSS for styling and converts to PDF.
 */
@Injectable()
export class PdfGeneratorService {
  private template: HandlebarsTemplateDelegate | null = null;
  private readonly templatePath: string;

  constructor() {
    this.templatePath = path.join(__dirname, '../templates/report-template.hbs');
  }

  /**
   * Load and compile Handlebars template
   */
  private async loadTemplate(): Promise<HandlebarsTemplateDelegate> {
    if (this.template) {
      return this.template;
    }

    try {
      const templateContent = await fs.readFile(this.templatePath, 'utf-8');
      this.template = Handlebars.compile(templateContent);
      return this.template;
    } catch (error) {
      throw new InternalServerErrorException(`Failed to load PDF template: ${error.message}`);
    }
  }

  /**
   * Generate PDF from report data
   *
   * @param options Report configuration and data
   * @returns PDF as Buffer
   */
  async generate(options: PdfGenerationOptions): Promise<Buffer> {
    try {
      // Load and compile template
      const template = await this.loadTemplate();

      // Prepare template data
      const templateData = {
        reportName: options.reportName,
        description: options.description || '',
        generatedAt: new Date().toLocaleString('pt-BR', {
          dateStyle: 'long',
          timeStyle: 'short',
        }),
        totalRecords: options.data.length,
        generatedBy: options.generatedBy,
        footerNote: options.footerNote || 'Este relatório é confidencial',
        columns: options.columns,
        data: options.data,
        summary: options.summary,
      };

      // Render HTML
      const html = template(templateData);

      // Launch Puppeteer
      const browser = await puppeteer.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-gpu',
        ],
      });

      try {
        const page = await browser.newPage();

        // Set content and wait for rendering
        await page.setContent(html, {
          waitUntil: 'networkidle0',
        });

        // Generate PDF
        const pdf = await page.pdf({
          format: 'A4',
          printBackground: true,
          margin: {
            top: '20px',
            right: '20px',
            bottom: '20px',
            left: '20px',
          },
        });

        return Buffer.from(pdf);
      } finally {
        await browser.close();
      }
    } catch (error) {
      throw new InternalServerErrorException(`Failed to generate PDF: ${error.message}`);
    }
  }

  /**
   * Generate PDF with custom HTML
   *
   * @param html Custom HTML content
   * @returns PDF as Buffer
   */
  async generateFromHtml(html: string): Promise<Buffer> {
    try {
      const browser = await puppeteer.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-gpu',
        ],
      });

      try {
        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: 'networkidle0' });

        const pdf = await page.pdf({
          format: 'A4',
          printBackground: true,
          margin: {
            top: '20px',
            right: '20px',
            bottom: '20px',
            left: '20px',
          },
        });

        return Buffer.from(pdf);
      } finally {
        await browser.close();
      }
    } catch (error) {
      throw new InternalServerErrorException(`Failed to generate PDF from HTML: ${error.message}`);
    }
  }
}
