import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../../services/cce/authentication.service';
import { BasicRegistrationModel } from '../../../models/cce/basic-registration.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  errorMessage: string;
  error = false;
  isRegistering = false;

  constructor(private formBuilder: FormBuilder, private router: Router, private authenticationService: AuthenticationService) {}

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(30)]],
    });
  }

  async onRegisterSubmit() {
    this.registerForm.disable();
    this.isRegistering = true;
    const email = this.registerForm.get('email').value;
    try {
      const regModel: BasicRegistrationModel = {
        email,
        password: this.registerForm.get('password').value,
        firstName: this.registerForm.get('firstName').value,
        lastName: this.registerForm.get('lastName').value,
      };
      const result = await this.authenticationService.register(
        regModel
        // this.registerForm.get('firstName').value,
        // this.registerForm.get('lastName').value,
        // this.registerForm.get('email').value,
        // this.registerForm.get('password').value
      );
      if (result.errorMsg) {
        this.isRegistering = false;
        alert(result.errorMsg);
        return;
      }
      alert('Please check your email for a verification and then complete signin');
      this.isRegistering = false;
      await this.router.navigate(['/', 'signin'], { queryParams: { email: email } });
    } catch (err) {
      this.isRegistering = false;
    }
  }
}
