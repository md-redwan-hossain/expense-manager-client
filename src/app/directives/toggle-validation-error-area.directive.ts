import { DestroyRef, Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Directive({
  selector: '[ToggleValidationErrorArea]',
  standalone: true,
})
export class ToggleValidationErrorAreaDirective {
  constructor(
    private readonly templateRef: TemplateRef<any>,
    private readonly viewContainer: ViewContainerRef,
    private readonly destroyRef: DestroyRef
  ) {}

  private hasView = false;

  @Input({ required: true }) set ToggleValidationErrorArea(control: AbstractControl) {
    if (!control) return;
    control.statusChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.updateView(control);
    });

    // Initial check
    this.updateView(control);
  }

  private updateView(control: AbstractControl) {
    const hasError = (control.invalid && (control.dirty || control.touched)) ?? false;

    if (hasError && !this.hasView) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.hasView = true;
    } else if (!hasError && this.hasView) {
      this.viewContainer.clear();
      this.hasView = false;
    }
  }
}
