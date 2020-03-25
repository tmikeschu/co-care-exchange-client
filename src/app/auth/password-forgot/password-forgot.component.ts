import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PasswordService } from '../../services/password.service';
import { AuthenticationService } from '../../services/cce/authentication.service';

@Component({
  selector: 'app-password-forgot',
  templateUrl: './password-forgot.component.html',
  styleUrls: ['./password-forgot.component.scss'],
})
export class PasswordForgotComponent implements OnInit {
  forgotPwFormGroup: FormGroup;
  passwordResponse;
  error = false;

  constructor(private fb: FormBuilder, private authenticationService: AuthenticationService) {
    this.createForm();
  }

  createForm() {
    this.forgotPwFormGroup = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  ngOnInit() {}

  async onSubmit() {
    this.error = false;
    try {
      const result = await this.authenticationService.forgetPassword(this.forgotPwFormGroup.get('email').value);
      console.log('DEBUG forget passwd result ', result);
      // todo --notify user that an email has been sent
      this.passwordResponse = result;
    } catch (err) {
      console.log('Forget Password error ', err);
      this.error = true;
    }
  }

  resetError() {
    this.error = false;
  }

  get userEmail() {
    return this.forgotPwFormGroup.get('email');
  }
}
