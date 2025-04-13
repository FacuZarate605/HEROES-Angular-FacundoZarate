import { Directive, ElementRef, HostListener, inject } from '@angular/core';

@Directive({
  selector: '[appUppercase]',
  standalone: true
})
export class UppercaseDirective {
  private el = inject(ElementRef);

  @HostListener('input', ['$event']) onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const start = input.selectionStart;
    const end = input.selectionEnd;
    
    input.value = input.value.toUpperCase();
    input.setSelectionRange(start, end);
    
    input.dispatchEvent(new Event('input'));
  }
}