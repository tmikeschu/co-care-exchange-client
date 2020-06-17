import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AuthenticationService } from 'src/app/core/services/cce/authentication.service';

@Component({
    selector: 'app-password-change',
    templateUrl: './password-change.component.html',
    styleUrls: ['./password-change.component.scss'],
  })
  export class PasswordChangeComponent implements OnInit {
     
    constructor(private fb: FormBuilder, private authenticationService: AuthenticationService) {
      
    }  
  
    ngOnInit() {}
}