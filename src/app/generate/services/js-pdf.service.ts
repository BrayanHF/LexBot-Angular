import { Injectable } from '@angular/core';
import { jsPDF } from 'jspdf';

@Injectable({
  providedIn: 'root'
})
export class JsPdfService {

  private doc = new jsPDF('p', 'pt', 'a4');
  private readonly margin = 72;
  private y = 72;

  constructor() {
    this.setFont();
  }

  private setFont() {

  }

  public writeBlock(text: string, align: 'left' | 'right' | 'center' = 'left', spacing = 16) {
    const pageWidth = this.doc.internal.pageSize.getWidth();
    const pageHeight = this.doc.internal.pageSize.getHeight();
    const usableWidth = pageWidth - 2 * this.margin;

    this.doc.setFont('ArialCustom');
    this.doc.setFontSize(12);

    const lines = this.doc.splitTextToSize(text, usableWidth);
    const blockHeight = lines.length * spacing;

    if (this.y + blockHeight > pageHeight - this.margin) {
      this.doc.addPage();
      this.y = this.margin;
    }

    lines.forEach((line: string | string[]) => {
      const x = align === 'right'
        ? pageWidth - this.margin
        : align === 'center'
          ? pageWidth / 2
          : this.margin;

      this.doc.text(line, x, this.y, { align });
      this.y += spacing;
    });

    this.y += spacing - 4;
  }

  public save(filename: string): void {
    this.doc.save(filename);
    this.doc = new jsPDF('p', 'pt', 'a4');
    this.y = this.margin;
  }

}
