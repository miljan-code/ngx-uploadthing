# ngx-uploadthing

An unofficial Angular 17+ wrapper for [Uploadthing](https://github.com/pingdotgg/uploadthing).

## Prerequisites

- Angular 17

## Installation

To install ngx-uploadthing, run the following command in your project directory:

```bash
npm install ngx-uploadthing
```

## Getting started

To begin using ngx-uploadthing in your project, follow these steps:

1. Import the uploadthing provider inside your app.config.ts file:

```typescript
import { provideUploadthing } from "ngx-uploadthing";
import { OurFileRouter } from "~server/uploadthing.ts";

export const appConfig: ApplicationConfig = {
  providers: [
    ...,
    provideUploadthing<OurFileRouter>({
      // Replace with your own uploadthing endpoint
      url: "http://localhost:3000/api/uploadthing",
    }),
  ],
};
```

2. Use UploadthingDirective in your template to create a file uploader:

```typescript
import { Component } from "@angular/core";
import {
  type UploadedFileData,
  type UploaderConfig,
  UploadthingDirective,
  UploadthingService
} from "ngx-uploadthing";

@Component({
  selector: "app-uploader",
  standalone: true,
  imports: [UploadthingDirective],
  providers: [UploadthingService],
  template: `
    <input
      type="file"
      multiple
      uploadthing
      [config]="config"
      (onUploadComplete)="handleUploadCompleted($event)"
      (onFilesSelected)="handleSelectedFiles($event)"
    />
  `,
})
export class UploaderComponent {
  config: UploaderConfig = {
    // Replace with your own uploadthing endpoint
    endpoint: "videoAndImage",
    // Set to true to enable uploads on input change
    instantUpload: true,
    ...,
  };

  handleUploadCompleted(files: UploadedFileData[]) {
    console.log(files);
  }

  handleSelectedFiles(files: FileList) {
    console.log(files);
  }
}
```

## Features

- **UploadthingService**: This service is a central part of the ngx-uploadthing library. It provides methods for uploading files and managing the upload state.

  - uploadFiles$: A Subject that emits an object containing the upload options and files.
  - files(): A signal that returns an array of uploaded files.
  - status(): A signal that returns the current upload status.
  - error(): A signal that returns the upload error if any.
