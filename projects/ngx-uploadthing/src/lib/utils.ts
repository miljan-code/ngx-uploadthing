import { ChangeDetectorRef, ElementRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { type Observable, debounceTime, fromEvent, tap } from 'rxjs';

export function rxHostListener<T extends Event>(event: string): Observable<T> {
  const cdr = inject(ChangeDetectorRef);

  return fromEvent<T>(inject(ElementRef).nativeElement, event).pipe(
    debounceTime(0),
    tap(() => cdr.markForCheck()),
    takeUntilDestroyed()
  );
}
