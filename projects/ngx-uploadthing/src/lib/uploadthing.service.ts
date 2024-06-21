import { Injectable, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EMPTY, Subject, catchError, concatMap, from, merge, tap } from 'rxjs';
import type { UploadedFileData } from 'uploadthing/types';
import { UPLOADTHING_TOKEN } from './uploadthing';

export interface UploadState {
  files: UploadedFileData[];
  status: 'pending' | 'uploading' | 'success' | 'error';
  error: string | null;
}

export interface UploadOpts {
  files: File[];
  endpoint: 'imageUploader' | 'videoAndImage' | string;
  onUploadBegin?: (opts: { file: string }) => void;
  onUploadProgress?: (opts: { file: string; progress: number }) => void;
  skipPolling?: boolean;
  headers?: HeadersInit | (() => Promise<HeadersInit>) | (() => HeadersInit);
}

@Injectable({ providedIn: 'root' })
export class UploadthingService {
  private uploadthing = inject(UPLOADTHING_TOKEN);

  private state = signal<UploadState>({
    files: [],
    status: 'pending',
    error: null,
  });

  public files = computed(() => this.state().files);
  public status = computed(() => this.state().status);
  public error = computed(() => this.state().error);

  uploadFiles$ = new Subject<UploadOpts>();

  filesUploaded$ = this.uploadFiles$.pipe(
    tap(() => {
      this.state.update((state) => ({ ...state, status: 'uploading' }));
    }),
    concatMap((opts) => {
      const { endpoint, ...options } = opts;
      return from(this.uploadthing.uploadFiles(endpoint, options)).pipe(
        catchError((err) => this.handleError(err))
      );
    })
  );

  constructor() {
    merge(this.filesUploaded$)
      .pipe(takeUntilDestroyed())
      .subscribe((files) => {
        return this.state.update((state) => ({
          ...state,
          files,
          status: 'success',
        }));
      });
  }

  private handleError(err: unknown) {
    if (err instanceof Error) {
      this.state.update((state) => ({
        ...state,
        error: err.message,
        status: 'error',
      }));
    }
    return EMPTY;
  }
}
