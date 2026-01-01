import { HttpClient, HttpStatusCode } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ReactiveFormErrorMessageComponent } from 'ngx-extra';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { firstValueFrom } from 'rxjs';
import { ToggleValidationErrorAreaDirective } from '../../directives/toggle-validation-error-area.directive';
import { SignupSchema } from './registration.models';

@Component({
  selector: 'app-registration',
  imports: [
    ReactiveFormsModule,
    ReactiveFormErrorMessageComponent,
    PasswordModule,
    CheckboxModule,
    InputTextModule,
    ButtonModule,
    ToggleValidationErrorAreaDirective,
  ],
  templateUrl: './registration.html',
  styleUrl: './registration.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Registration {
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
        validators: [Validators.requiredTrue],
      }),
    },
    { validators: [this.confirmPasswordValidator] }
  );

  async onSubmit() {
    const formValues = this.form.getRawValue();

    const parsed = SignupSchema.parse(formValues);
    console.log(parsed);
    // const response = await firstValueFrom(
    //   this.httpClient.post('', { ...parsed }, { observe: 'response' })
    // );

    // if (response.status === HttpStatusCode.Conflict) {
    //   this.form.controls.userName.setErrors({ duplicate: true });
    //   this.form.controls.userName.updateValueAndValidity();
    // }
    // if (response.status === HttpStatusCode.Created || response.status === HttpStatusCode.Ok) {
    //   this.router.navigateByUrl('login');
    // }
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
