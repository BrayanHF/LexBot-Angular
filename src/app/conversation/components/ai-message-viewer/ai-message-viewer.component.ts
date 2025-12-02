import { ChangeDetectionStrategy, Component, effect, input, signal } from '@angular/core';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import 'highlight.js/styles/github.css';

@Component({
  selector: 'conversation-ai-message-viewer',
  imports: [],
  template: `
    <div class="prose prose-stone text-black" [innerHTML]="safeHtml()"></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AiMessageViewerComponent {

  public text = input.required<string>();

  public safeHtml = signal('');

  constructor() {
    marked.setOptions({ async: false });

    effect(() => {
      const raw = this.text();
      const html = marked.parse(raw, { breaks: true }) as string;
      const clean = DOMPurify.sanitize(html);
      this.safeHtml.set(clean);
    });
  }

}
