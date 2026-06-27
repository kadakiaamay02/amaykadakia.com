import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import type { TDocumentDefinitions } from 'pdfmake/interfaces';

import { SIGNATURE_DATA_URI } from './credit-note.signature';
import { environment } from '@environments/environment';

// Wire pdfmake's bundled fonts (the export shape varies across builds).
const vfs =
  (pdfFonts as any)?.vfs ??
  (pdfFonts as any)?.pdfMake?.vfs ??
  (pdfFonts as any);
(pdfMake as any).vfs = vfs;

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const NAVY = '#21437E';

interface CreditNoteModel {
  snNumber: string;
  companyName: string;
  date: string;       // 'YYYY-MM-DD' from <input type="date">
  month: string;      // month name, e.g. "September"
  netSales: number | null;
  rate18: number | null;   // first rate (e.g. 18 or 118)
  amount18: number | null;
  rate40: number | null;   // second rate (e.g. 40 or 41)
  amount40: number | null;
  rate1: number | null;    // final rate (e.g. 1 or 2.5)
  amount: number | null;
}

@Component({
  selector: 'app-credit-note',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './credit-note.component.html',
  styleUrl: './credit-note.component.scss',
})
export class CreditNoteComponent {
  readonly months = MONTHS;
  private apiUrl = `${environment.apiUrl}/credit-note`;

  model: CreditNoteModel = {
    snNumber: '',
    companyName: '',
    date: this.toInputDate(new Date()),
    month: MONTHS[new Date().getMonth()],
    netSales: null,
    rate18: 18,
    amount18: null,
    rate40: 40,
    amount40: null,
    rate1: 1,
    amount: null,
  };

  error = '';
  http: any;

  /** Live preview of the amount-in-words line. */
  get amountWords(): string {
    return this.amountToWords(this.model.amount ?? 0);
  }

  private isValid(): boolean {
    const m = this.model;
    const required = [m.snNumber, m.companyName, m.date, m.month];
    if (required.some((v) => v === null || v === undefined || `${v}`.trim() === '')) return false;
    const numbers = [m.netSales, m.amount18, m.amount40, m.amount];
    return numbers.every((v) => v !== null && v !== undefined && !isNaN(Number(v)));
  }

  download(): void {
    if (!this.isValid()) { this.error = 'Please fill in every field.'; return; }
    this.error = '';
    const year = this.parseYear(this.model.date);
    const fileName = `CreditNote_${this.model.companyName || 'Company'}_${this.model.month}_${year}.pdf`
      .replace(/\s+/g, '_');
    pdfMake.createPdf(this.buildDocDefinition()).download(fileName);

    const subject = `Credit Note - ${this.model.companyName} - ${this.model.month} ${year}`;
    const d = this.model;
    const body_html = `<p>Credit note for <strong>${d.companyName}</strong> — ${d.month} ${year}.</p>
<p>Net Sales: ${d.netSales} | ${d.rate18}% = ${d.amount18} / ${d.rate40}% = ${d.amount40} | *${d.rate1}% = ${d.amount}</p>
<p>Amount: ${this.amountWords} Only.</p>`;
    this.http.post(this.apiUrl, { subject, body_html }).subscribe({
      next: () => {},
      error: () => this.error = 'Failed to send credit note.'
    });

  }

  preview(): void {
    if (!this.isValid()) { this.error = 'Please fill in every field.'; return; }
    this.error = '';
    pdfMake.createPdf(this.buildDocDefinition()).open();
  }

  // ---------------------------------------------------------------------------
  // PDF document definition (mirrors the Cosmos Trading credit-note letter)
  // ---------------------------------------------------------------------------
  private buildDocDefinition(): TDocumentDefinitions {
    const d = this.model;
    const monthName = d.month;
    const monthIndex = MONTHS.indexOf(monthName);
    const mm = String(monthIndex + 1).padStart(2, '0');
    const year = this.parseYear(d.date);
    const fy = `${year}-${year + 1}`;
    const lastDay = new Date(year, monthIndex + 1, 0).getDate();
    const firstDate = `1-${mm}-${year}`;
    const lastDate = `${lastDay}-${mm}-${year}`;
    const words = this.amountToWords(d.amount ?? 0);
    const displayDate = this.formatDate(d.date);

    return {
      pageSize: 'A4',
      pageMargins: [55, 45, 55, 55],
      defaultStyle: { fontSize: 11, color: '#000', lineHeight: 1.15 },
      content: [
        // Letterhead (sender — fixed)
        { text: 'Cosmos Trading Corporation', alignment: 'center', bold: true, fontSize: 24, color: NAVY },
        { text: '116 NARAYAN DHURU STREET, 1ST FLOOR MUMBAI-400003', alignment: 'center', bold: true, fontSize: 10, margin: [0, 2, 0, 0] },
        { text: '9820136894', alignment: 'center', bold: true, fontSize: 9, color: NAVY, margin: [0, 1, 0, 6] },
        { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 485, y2: 0, lineWidth: 2, lineColor: NAVY }] },

        { text: 'Credit Note', alignment: 'center', decoration: 'underline', fontSize: 12, margin: [0, 14, 0, 18] },

        { text: `NO.${d.snNumber}/${fy}` },
        { text: `Date: ${displayDate}`, alignment: 'right', margin: [0, 8, 0, 0] },

        { text: d.companyName, margin: [18, 14, 0, 0] },
        { text: 'Mumbai', margin: [18, 0, 0, 0] },

        {
          margin: [0, 16, 0, 0],
          alignment: 'center',
          text: [
            { text: 'Sub: ', bold: true },
            { text: `Credit note for the month of ${monthName} ${year}`, decoration: 'underline' },
          ],
        },

        { text: 'Dear Sir,', margin: [0, 16, 0, 0] },

        {
          margin: [0, 14, 0, 0],
          alignment: 'justify',
          lineHeight: 1.25,
          text:
            `        Please note that we have credit your a/c for the month of ${monthName} ` +
            `${firstDate} to ${lastDate}. Net sales Rs. ${d.netSales}/- TVS Socket T.O.D Rs. ${d.netSales}/- ` +
            `${d.rate18}% = ${d.amount18}/- /${d.rate40}% ${d.amount40}/- *${d.rate1}% Rs. ${d.amount}/-`,
        },

        { text: `Amount: ${words} Only.`, margin: [0, 16, 0, 0] },

        { image: SIGNATURE_DATA_URI, width: 120, alignment: 'right', margin: [0, 48, 6, 0] },
        { text: 'For Cosmos Trading Corporation', alignment: 'right' },
      ],
    };
  }

  // ---------------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------------
  private toInputDate(dt: Date): string {
    const m = String(dt.getMonth() + 1).padStart(2, '0');
    const day = String(dt.getDate()).padStart(2, '0');
    return `${dt.getFullYear()}-${m}-${day}`;
  }

  /** 'YYYY-MM-DD' -> 'DD/MM/YYYY' (falls back to the raw string). */
  private formatDate(value: string): string {
    const m = String(value || '').match(/^(\d{4})-(\d{2})-(\d{2})$/);
    return m ? `${m[3]}/${m[2]}/${m[1]}` : String(value || '');
  }

  private parseYear(value: string): number {
    const m = String(value || '').match(/(\d{4})/);
    return m ? parseInt(m[1], 10) : new Date().getFullYear();
  }

  // Indian numbering system (crore / lakh / thousand); compounds hyphenated.
  private amountToWords(input: string | number): string {
    const ONES = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
      'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const TENS = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

    const below100 = (n: number): string => {
      if (n < 20) return ONES[n];
      const t = Math.floor(n / 10), o = n % 10;
      return TENS[t] + (o ? '-' + ONES[o] : '');
    };
    const below1000 = (n: number): string => {
      const h = Math.floor(n / 100), r = n % 100;
      let out = '';
      if (h) out += ONES[h] + ' Hundred';
      if (r) out += (out ? ' ' : '') + below100(r);
      return out;
    };

    let num = Math.floor(Math.abs(Number(input) || 0));
    if (num === 0) return 'Zero';
    const crore = Math.floor(num / 10000000); num %= 10000000;
    const lakh = Math.floor(num / 100000); num %= 100000;
    const thousand = Math.floor(num / 1000); num %= 1000;
    const hundred = num;

    const parts: string[] = [];
    if (crore) parts.push(below1000(crore) + ' Crore');
    if (lakh) parts.push(below100(lakh) + ' Lakh');
    if (thousand) parts.push(below100(thousand) + ' Thousand');
    if (hundred) parts.push(below1000(hundred));
    return parts.join(' ');
  }
}
