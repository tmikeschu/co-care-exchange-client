import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../services/auth/authentication.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;
  errorMessage: string;
  error = false;
  isRegistering = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService,
  ) { }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(30)]]
    });
  }


  onRegisterSubmit() {
    this.registerForm.disable();
    this.isRegistering = true;
    this.authenticationService.register(
      this.registerForm.get('firstName').value,
      this.registerForm.get('lastName').value,
      this.registerForm.get('email').value, this.registerForm.get('password').value
    )
      .subscribe(() => {
        this.router.navigate(['/signIn']);
        this.isRegistering = false;
      },
        error => {
          alert(error);
        });
  }
}
