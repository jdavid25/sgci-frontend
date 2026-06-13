import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  enviando = false;
  mensajeError = '';

  readonly form = this.formBuilder.nonNullable.group({
    nombreUsuario: ['', Validators.required],
    clave: ['', Validators.required]
  });

  ingresar(): void {
    this.mensajeError = '';

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.enviando = true;
    this.authService.login(this.form.getRawValue())
      .pipe(finalize(() => this.enviando = false))
      .subscribe({
        next: () => this.router.navigate(['/dashboard']),
        error: (error) => {
          this.mensajeError = error.error?.message ?? 'No fue posible iniciar sesion.';
        }
      });
  }
}
