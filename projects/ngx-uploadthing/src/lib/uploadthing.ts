import { InjectionToken } from '@angular/core';
import { genUploader } from 'uploadthing/client';
import type { FileRouter } from 'uploadthing/types';

export const UPLOADTHING_TOKEN = new InjectionToken<{
  uploadFiles: ReturnType<typeof genUploader>;
}>('UPLOADTHING_TOKEN');

export function provideUploadthing<T extends FileRouter>(config: {
  url: string;
}) {
  return {
    provide: UPLOADTHING_TOKEN,
    useFactory: () => ({
      uploadFiles: genUploader<T>({
        url: config.url,
        package: 'ngx-uploadthing',
      }),
    }),
  };
}
