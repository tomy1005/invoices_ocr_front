import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],

})
export class LoginComponent {
  showPassword = false; // 👈 Para controlar la visibilidad

  constructor(private fb: FormBuilder, private router: Router, private authService: AuthService) { }

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  loginError: boolean = false;

  onSubmit() {

    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.authService.signin({ email: email, password: password }).subscribe(data => {
        localStorage.setItem('token', data.token ?? '');
        localStorage.setItem('enterpriseId', data.enterprise ?? '');
        localStorage.setItem('roles', data.roles ?? '');
        localStorage.setItem('userId', data.id ?? '');
        this.router.navigate(['/remitos/main']);
      }, error => {
        this.loginError = true;
        setTimeout(() => {
          this.loginError = false;
        }, 2000);

      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  get email() {
    return this.loginForm.get('email');
  }
  get password() {
    return this.loginForm.get('password');
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }
}
