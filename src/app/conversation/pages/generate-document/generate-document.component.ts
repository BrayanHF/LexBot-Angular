import { AfterViewInit, Component, computed, effect, ElementRef, inject, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Message } from '../../interfaces/message.interface';

import { RightPetitionService } from '../../../generate/services/right-petition.service';
import { DocumentIDType } from '../../enum/document-id-type.enum';
import { DocumentId } from '../../../generate/interfaces/document-id.interface';
import { MessageInputComponent } from '../../components/message-input/message-input.component';
import { MessageListComponent } from '../../components/message-list/message-list.component';

@Component({
  selector: 'conversation-generate-document',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MessageInputComponent,
    MessageListComponent
  ],
  templateUrl: './generate-document.component.html',
  styles: [ `
    .pb-dynamic {
      padding-bottom: var(--pb);
    }
  ` ]
})
export default class GenerateDocumentComponent implements AfterViewInit, OnDestroy {

  @ViewChild('messageInput') messageInput!: MessageInputComponent;
  @ViewChild('rpForm', { read: ElementRef }) rpForm!: ElementRef<HTMLDivElement>;

  private fb = inject(FormBuilder);
  public rightPetitionService = inject(RightPetitionService);

  public form: FormGroup = this.fb.group({
    type: [ null, Validators.required ],
    number: [ '', [ Validators.required ] ]
  });

  public errorMessage = '';
  public started = false;
  public documentTypes = Object.values(DocumentIDType);
  public messages = computed<Message[]>(this.rightPetitionService.messages);

  private resizeObserver!: ResizeObserver;

  constructor() {
    effect(() => {
      if (this.messages().length && this.rpForm) {
        queueMicrotask(() => this.scrollToBottom());
      }
    });
  }

  ngAfterViewInit(): void {
    const element = this.messageInput.messageInput.nativeElement;

    this.resizeObserver = new ResizeObserver(() => {
      const height = element.offsetHeight;
      document.documentElement.style.setProperty('--pb', `${ height + 96 }px`);
    });

    this.resizeObserver.observe(element);
  }

  ngOnDestroy(): void {
    if (this.resizeObserver) this.resizeObserver.disconnect();
  }

  public onMessageSend(content: string): void {
    this.rightPetitionService.handleUserMessage(content);
    this.scrollToBottom();
  }

  public onSubmit(): void {
    if (!this.isValidField()) return;

    this.started = true;
    this.form.disable();
    this.rightPetitionService.start(this.form.value);
  }

  public isValidField(): boolean {
    if (!this.form.get('number')?.touched) return false;

    const doc: DocumentId = {
      type: this.form.value.type,
      number: this.form.value.number,
      expedition: '',
      error: null
    };

    const validated = this.rightPetitionService.validateDocument(doc);

    if (validated.error) {
      this.errorMessage = validated.error;
      return false;
    }

    return true;
  }

  public openPdf(): void {
    if (this.rightPetitionService.pdfName()) {
      this.rightPetitionService.getPdf();
    }
  }

  private scrollToBottom(): void {
    this.rpForm.nativeElement.scrollTop = this.rpForm.nativeElement.scrollHeight;
  }

}
