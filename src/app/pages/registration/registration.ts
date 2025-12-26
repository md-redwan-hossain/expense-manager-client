import { HttpClient, HttpStatusCode } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { SignupSchema } from './registration.models';
import { firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';
@Component({
  selector: 'app-registration',
  imports: [ReactiveFormsModule],
  templateUrl: './registration.html',
  styleUrl: './registration.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Registration {
  // reactive disable logic
  readonly fb = inject(FormBuilder);
  readonly httpClient = inject(HttpClient);
  readonly router = inject(Router);

  readonly form = this.fb.group(
    {
      userName: this.fb.control('', { validators: [Validators.required] }),
      password: this.fb.control('', {
        validators: [Validators.required, Validators.minLength(6), Validators.maxLength(60)],
      }),
      confirmPassword: this.fb.control('', {
        validators: [Validators.required, Validators.minLength(6), Validators.maxLength(60)],
      }),
      agreeWithTermsAndCondition: this.fb.control<boolean>(false, {
        validators: [Validators.required],
      }),
    },
    { validators: [this.confirmPasswordValidator], updateOn: 'submit' },
  );

  async onSubmit() {
    const formValues = this.form.getRawValue();

    if (!formValues.agreeWithTermsAndCondition) {
      this.form.controls.agreeWithTermsAndCondition.setErrors({ notAgreed: true });
      this.form.controls.agreeWithTermsAndCondition.updateValueAndValidity();
    }

    const parsed = SignupSchema.parse(formValues);
    const response = await firstValueFrom(
      this.httpClient.post('', { ...parsed }, { observe: 'response' }),
    );

    if (response.status === HttpStatusCode.Conflict) {
      this.form.controls.userName.setErrors({ duplicate: true });
      this.form.controls.userName.updateValueAndValidity();
    }
    if (response.status === HttpStatusCode.Created || response.status === HttpStatusCode.Ok) {
      this.router.navigateByUrl('login');
    }
  }

  confirmPasswordValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { passwordsDoNotMatch: true };
    }
    return null;
  }
}
