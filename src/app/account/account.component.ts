import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { DASHBOARD_ROUTE, INFO_ROUTE, PROMPT_ROUTE } from '../core/constants/routes';

declare global {
  interface Window {
      PaymentRequest: PaymentRequest;
  }
}
@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
})
export class AccountComponent implements OnInit {
  constructor(
    @Inject('Window') private window: Window,
    private router: Router,
  ) { }
  ngOnInit() {
    window.scrollTo(0, 0);
  }

  edit() {
    this.router.navigate(['/', INFO_ROUTE]);
  }
  add() {
    this.router.navigate(['/', PROMPT_ROUTE]);
  }
  close() {
    this.router.navigate(['/', DASHBOARD_ROUTE]);
  }
  resource() {
    this.router.navigate(['/resources']);
  }
  showContributors() {
    this.router.navigate(['/contributors']);
  }

  async makePayment() {
    if (('PaymentRequest' in this.window)) {
      console.log('PaymentRequest supported');
      const paymentMethods = [
        {
          supportedMethods: ['basic-card']
        }
      ];

      const paymentDetails = {
        total: {
          label: 'Thanks for your donation!',
          amount: {
            currency: 'USD',
            value: '20.00'
          }
        }
      };

      try {
        const paymentRequest = new PaymentRequest(paymentMethods, paymentDetails);
        const response = await paymentRequest.show();
        console.log('payment request response: ', response);
      } catch (e) {
        console.error('error occurred with payment request: ', e);
      }
    } else {
      console.log('PaymentRequest not supported');
    }
  }
}
