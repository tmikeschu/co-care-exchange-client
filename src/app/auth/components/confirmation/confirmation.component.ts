import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../../../core/services/cce/authentication.service';
import {ToastrService} from 'ngx-toastr';
import {filter} from 'rxjs/operators';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss'],
})
export class ConfirmationComponent implements OnInit {
  confirmationForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private authenticationService: AuthenticationService,
    private toastrService: ToastrService,
  ) {
    this.createForm();
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((val) => {
      console.log('DEBUG signin confirm email ', val);
      const email = val.email;
      if (email) {
        this.confirmationForm.get('email').setValue(email);
      }
    });
  }

  private createForm(): void {
    this.confirmationForm = this.fb.group({
      email: ['', [Validators.email]],
      confirmCode: ['', [Validators.required]],
    });
  }

  onConfirmSubmit(): void {
    this.authenticationService.confirm(this.confirmationForm.controls.email.value, this.confirmationForm.controls.confirmCode.value).then(
      (result) => {
        console.log('DEBUG confirm result ', result);
        // TODO toast success?
        // route to signin or dashboard
        this.router.navigate(['/', 'dashboard']);
      },
      (err) => {
        console.error('Confirm error ', err);
        // TODO toast error
      }
    );
  }

  onResendCode(): void {
    this.authenticationService.resendCode(this.confirmationForm.controls.email.value).then(
      (result) => {
        console.log('DEBUG, resend code result ', result);
        // TODO -- show toast notification of success
      },
      (err) => {
        console.error(err);
        // TODO error toast
      }
    );
  }

  get email() {
    return this.confirmationForm.get('email');
  }

  get confirmCode() {
    return this.confirmationForm.get('confirmCode');
  }
}
