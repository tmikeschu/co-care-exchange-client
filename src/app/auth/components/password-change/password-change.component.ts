import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { AuthenticationService } from 'src/app/core/services/cce/authentication.service';
import { CustomValidators } from 'src/app/shared/custom-validators';
import { ErrorStateMatcher, MatDialogRef } from '@angular/material';
import { UserProfile } from 'src/app/models/UserProfile';
import { ToastrService } from 'ngx-toastr';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const invalidCtrl = !!(control && control.invalid && control.parent.dirty);
    const invalidParent = !!(control && control.parent && control.parent.invalid && control.parent.dirty);

    return invalidCtrl || invalidParent;
  }
}

@Component({
    selector: 'app-password-change',
    templateUrl: './password-change.component.html',
    styleUrls: ['./password-change.component.scss'],
  })
  export class PasswordChangeComponent implements OnInit {
    pwChangeForm: FormGroup;
    userProfile: UserProfile;
     
    constructor(public dialogRef: MatDialogRef<PasswordChangeComponent>, private fb: FormBuilder, private authenticationService: AuthenticationService, private toastrService: ToastrService) {
      
    }  
  
    ngOnInit() {
      this.pwChangeForm = this.fb.group(
        {
          currentPassword:[null, Validators.compose([Validators.required])],
          newPassword: [
            null,
            Validators.compose([
              Validators.required,
              // check whether the entered password has a number
              CustomValidators.patternValidator(/\d/, {
                hasNumber: true,
              }),
              // check whether the entered password has upper case letter
              CustomValidators.patternValidator(/[A-Z]/, {
                hasCapitalCase: true,
              }),
              // check whether the entered password has a lower case letter
              CustomValidators.patternValidator(/[a-z]/, {
                hasSmallCase: true,
              }),
              // check whether the entered password has a special character
              CustomValidators.patternValidator(/[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/, {
                hasSpecialCharacters: true,
              }),
              Validators.minLength(8),
            ]),
          ],
          confirmNewPassword: [null, Validators.compose([Validators.required])]
        },
        {
          // check whether our password and confirm password match
          validator: CustomValidators.newPasswordMatchValidator,
        }
      );
    }

    async onSubmit(){      
      
      try{
        const result: any = await this.authenticationService.changePassword(this.controls.currentPassword.value, this.controls.newPassword.value);
        
        if(result === 'SUCCESS'){
          this.toastrService.success('Password change success.', null, {
            positionClass: 'toast-top-center',
          });

          this.dialogRef.close('Success');
        }
      } catch (err) {
        console.error(err);
        this.toastrService.error('Your Current password is not correct.', null, {
          positionClass: 'toast-top-center',
        });
      } finally {
        
      }
    }

    onCancelClick(){
      this.dialogRef.close('Cancel');
    }

    // convenience getter for easy access to form fields
    get controls() { return this.pwChangeForm.controls; }
}