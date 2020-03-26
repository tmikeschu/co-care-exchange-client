import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material';
import { ActivatedRoute, Router} from '@angular/router';;
import { AuthenticationService } from '../../services/cce/authentication.service';
import { FORGET_PASSWORD_ROUTE, RESET_PASSWORD_ROUTE, SIGNIN_ROUTE} from '../../constants/routes';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const invalidCtrl = !!(control && control.invalid && control.parent.dirty);
    const invalidParent = !!(control && control.parent && control.parent.invalid && control.parent.dirty);

    return (invalidCtrl || invalidParent);
  }
}


@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.scss']
})

export class PasswordResetComponent implements OnInit {
  pwResetForm: FormGroup;
  hide = true;
  email = null;

  success = null;

  errorStateMatcher = new MyErrorStateMatcher();

  constructor(private fb: FormBuilder, private router: Router, private route: ActivatedRoute, private authenticationService: AuthenticationService
  ) {
    this.createForm();
  }

  createForm() {
    this.pwResetForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(30)]],
      passwordConfirm: [''],
      resetCode: ['', [Validators.required]]
    }, { validator: this.checkPasswords });
  }

  ngOnInit() {
    this.route.queryParams.subscribe(val => {
      console.log('DEBUG reset email ', val);
      this.email = val.email;
      if (!this.email) {
        // TODO -- error, route back to forget password?
      }
    });
  }

  async onLoginSubmit() {
    if (!this.email) {
      return  await this.router.navigate(['/', FORGET_PASSWORD_ROUTE]);
    }
    try {
      const result = await this.authenticationService.forgetPasswordComplete(this.email, this.pwResetForm.controls.resetCode.value, this.pwResetForm.controls.passwordConfirm.value);
      this.success = true;
      await this.router.navigate(['/', SIGNIN_ROUTE]);
    } catch (err) {
      console.error('Error resetting password ', err);
    }
  }

  checkPasswords(group: FormGroup) { // here we have the 'passwords' group
    const password = group.controls.password.value;
    const confirmPass = group.controls.passwordConfirm.value;
    return password === confirmPass ? null : { notSame: true };
  }

  get password() {
    return this.pwResetForm.get('password');
  }

  get passwordConfirm() {
    return this.pwResetForm.get('passwordConfirm');
  }

  get resetCode() {
    return this.pwResetForm.get('resetCode');
  }

}
