import {
  AfterViewInit,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  OnDestroy,
  signal,
  ViewChild
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { DocumentGenerator } from '../../../generate/interfaces/document-generator,interface';
import { ComplaintService } from '../../../generate/services/complaint.service';
import { validateDocument } from '../../../generate/helpers/helper';
import { DOCUMENT_GENERATORS, DocumentGeneratorType } from '../../../shared/types/document-generators';

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

  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);
  private title = inject(Title);

  public currentService = signal<DocumentGenerator | null>(null);
  public rightPetitionService = inject(RightPetitionService);
  public complaintService = inject(ComplaintService);

  public documentToGenerate = signal('');

  public form: FormGroup = this.fb.group({
    type: [ null, Validators.required ],
    number: [ '', [ Validators.required ] ]
  });

  public errorMessage = '';
  public started = false;
  public documentTypes = Object.values(DocumentIDType);
  public messages = computed(() => this.currentService()?.messages() ?? []);
  public pdfLink = computed(() => this.currentService()?.pdfLink() ?? null);
  private resizeObserver!: ResizeObserver;

  constructor() {
    this.setDocumentToGenerate();
    effect(() => {
      if (this.messages().length && this.rpForm) {
        queueMicrotask(() => this.scrollToBottom());
      }
      if (this.pdfLink()) {
        this.scrollToBottom();
      }
      if (this.documentToGenerate()) {
        this.title.setTitle(this.documentToGenerate());
      }
    });
  }

  private servicesMap: Record<DocumentGeneratorType, DocumentGenerator> = {
    'right-petition': this.rightPetitionService,
    'complaint': this.complaintService,
    'power-of-attorney': this.rightPetitionService,
    'habeas-data': this.rightPetitionService,
  };

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
    this.currentService()?.cleanAll();
  }

  public setDocumentToGenerate(): void {
    this.route.params.subscribe(params => {
      const docType: DocumentGeneratorType = params['document'];
      const document = DOCUMENT_GENERATORS[docType];
      if (document.label != this.documentToGenerate()) {

        this.anotherDocument();
        this.documentToGenerate.set(document.label);


        const service = this.servicesMap[docType];
        if (!service) {
          console.error(`No service found for document type: ${ docType }`);
          return;
        }

        this.currentService.set(service);
      }

    });
  }

  public onMessageSend(content: string): void {
    this.currentService()?.handleUserAnswers(content);
    this.scrollToBottom();
  }

  public onSubmit(): void {
    if (!this.isValidField()) return;

    this.started = true;
    this.form.disable();
    this.currentService()?.startQuestions(this.form.value);
  }

  public isValidField(): boolean {
    if (!this.form.get('number')?.touched) return false;

    const doc: DocumentId = {
      type: this.form.value.type,
      number: this.form.value.number,
      expedition: '',
      error: null
    };

    const validated = this.validateDocument(doc);

    if (validated.error) {
      this.errorMessage = validated.error;
      return false;
    }

    return true;
  }

  public openPdf(): void {
    if (this.currentService()?.pdfLink()) {
      this.currentService()?.getPdf();
    }
  }

  private scrollToBottom(): void {
    this.rpForm.nativeElement.scrollTop = this.rpForm.nativeElement.scrollHeight;
  }

  public anotherDocument(): void {
    this.form.reset();
    this.form.enable();
    this.started = false;
    this.errorMessage = '';
    this.currentService()?.cleanAll();
  }

  public validateDocument(document: DocumentId): DocumentId {
    const trimmed = document.number.trim();
    const type = document.type;

    const validation = validateDocument[type];
    if (!validation) {
      document.error = 'Tipo de documento no reconocido.';
      return document;
    }

    if (!validation.regex.test(trimmed)) {
      document.error = validation.error;
    }

    return document;
  }

}
