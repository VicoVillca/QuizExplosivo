import { Component, Input, AfterViewInit, ElementRef, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { OrganizedResult } from '../../../core/models/code-block.model';
import { labels } from '../../../core/constants/labels.constants';
import { messages } from '../../../core/constants/messages.constants';

declare var Prism: any;
@Component({
  selector: 'app-code-output',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  templateUrl: './code-output.component.html',
  styleUrls: ['./code-output.component.scss']
})
export class CodeOutputComponent implements AfterViewInit, OnChanges {
  @Input() result: OrganizedResult | null = null;
  @ViewChild('codeElement') codeElement!: ElementRef;

  label = labels;
  message = messages;

  constructor() { }

  copyToClipboard() {
    if (this.result?.organizedCode) {
      navigator.clipboard.writeText(this.result.organizedCode)
        .catch(err => {
          console.error('Error al copiar:', err);
        });
    }
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.applySyntaxHighlighting();
    });
  }

  ngOnChanges(changes: SimpleChanges) {

    if (changes['result'] && changes['result'].currentValue) {
      this.forceHighlightUpdate();
    }
  }

  private applySyntaxHighlighting() {

    if (!this.codeElement?.nativeElement) {
      return;
    }

    if (!this.result?.organizedCode) {
      return;
    }

    if (typeof Prism === 'undefined') {
      return;
    }

    Prism.highlightElement(this.codeElement.nativeElement);
  }

  private forceHighlightUpdate() {
    setTimeout(() => {
      if (!this.codeElement?.nativeElement || !this.result?.organizedCode) {
        return;
      }

      const codeElement = this.codeElement.nativeElement;

      codeElement.className = '';
      codeElement.textContent = this.result.organizedCode;

      codeElement.classList.add('language-java');

      const preElement = codeElement.parentElement;
      if (preElement && preElement.tagName === 'PRE') {
        preElement.className = 'language-java';
      }

      void codeElement.offsetHeight;

      if (typeof Prism !== 'undefined') {
        Prism.highlightElement(codeElement);
      }
    });
  }

  getLineCount(): number {
    return this.result?.organizedCode?.split('\n').length || 0;
  }

  getFileSize(): string {
    if (!this.result?.organizedCode) return '0';
    const bytes = new Blob([this.result.organizedCode]).size;
    return (bytes / 1024).toFixed(2);
  }

  getProcessingTime(): number {
    return this.result?.stats?.processingTime || 0;
  }

  getLinesReduced(): number {
    return this.result?.stats?.linesReduced || 0;
  }
}