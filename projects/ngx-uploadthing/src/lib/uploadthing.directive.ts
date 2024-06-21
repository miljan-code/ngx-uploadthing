import {
  AfterContentInit,
  Directive,
  OnDestroy,
  effect,
  inject,
  input,
  output,
} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import type { UploadedFileData } from 'uploadthing/types';
import { rxHostListener } from './utils';
import { type UploadOpts, UploadthingService } from './uploadthing.service';

export type UploaderConfig = Omit<UploadOpts, 'files'> & {
  instantUpload?: boolean;
};

@Directive({
  selector: '[uploadthing]',
  standalone: true,
})
export class UploadthingDirective implements AfterContentInit, OnDestroy {
  private changeListener$ = rxHostListener('change');
  private destroy$ = new Subject<void>();
  private uploader = inject(UploadthingService);
  public onUploadComplete = output<UploadedFileData[]>();
  public onFilesSelected = output<FileList>();
  public config = input<UploaderConfig>({
    endpoint: 'imageUploader',
  });

  constructor() {
    effect(() => {
      this.onUploadComplete.emit(this.uploader.files());
    });
  }

  ngAfterContentInit(): void {
    this.changeListener$.pipe(takeUntil(this.destroy$)).subscribe((event) => {
      const element = event.target as HTMLInputElement;
      if (!element.files || element.files.length === 0) {
        return;
      }
      const files = Array.from(element.files);
      this.onFilesSelected.emit(element.files);
      const { instantUpload, ...config } = this.config();
      if (instantUpload) {
        this.uploader.uploadFiles$.next({ ...config, files });
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
