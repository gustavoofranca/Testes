import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  error: string = '';
  showPassword: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    // Se já estiver logado, redirecionar para orders
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/orders']);
    }
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  async onSubmit() {
    if (this.loginForm.valid) {
      try {
        const { email, password } = this.loginForm.value;
        await this.authService.login(email, password);
        this.router.navigate(['/orders']);
      } catch (error) {
        console.error('Login error:', error);
        this.error = 'Email ou senha inválidos';
      }
    } else {
      this.error = 'Por favor, preencha todos os campos corretamente';
    }
  }
}
