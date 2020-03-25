import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { PasswordService } from '../../services/password.service';
import { User } from '../../models/User';

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
  user: User = new User({ // TODO: removed this temp user (for testing)
    id: 234,
    // firstName: string;
    // lastName: string;
    email: 'josh.blair@gmail.com'
    // password: string;
    // name: string;
    // roles: Role[];
    // token: string;
    // navToLessons: boolean;
    // resetToken: string;
    // verificationToken: string;
  });

  success = null;

  errorStateMatcher = new MyErrorStateMatcher();

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private passwordService: PasswordService
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
      this.passwordService.getUserByToken(val.token).subscribe(user => {
        if (user.hasOwnProperty('email')) {
          this.user = user;
        }
      });
    });
  }

  onLoginSubmit() {
    this.passwordService.update(this.user.resetToken, this.pwResetForm.controls.passwordConfirm.value).subscribe(val => {
      if (val.hasOwnProperty('email')) {
        this.success = true;
      } else {
        this.success = false;
      }
    });
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
