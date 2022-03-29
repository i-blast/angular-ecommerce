import { Component, Inject, OnInit } from '@angular/core';
import { OktaAuthStateService, OKTA_AUTH } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';

@Component({
  selector: 'app-login-status',
  templateUrl: './login-status.component.html',
  styleUrls: ['./login-status.component.css'],
})
export class LoginStatusComponent implements OnInit {
  isAuthenticated: boolean = false;
  userFullName: string = '';

  storage: Storage = sessionStorage;

  constructor(
    @Inject(OKTA_AUTH) private oktaAuth: OktaAuth,
    private authStateService: OktaAuthStateService
  ) {}

  async ngOnInit() {
    this.authStateService.authState$.subscribe((authState) => {
      this.isAuthenticated = !!authState.isAuthenticated;
      if (this.isAuthenticated) {
        this.oktaAuth.getUser().then((res) => {
          this.userFullName = res.name as string;

          const userEmail = res.email;
          this.storage.setItem('userEmail', JSON.stringify(userEmail));
        });
      }
    });

    // this.isAuthenticated = await this.oktaAuth.isAuthenticated();
    // if (this.isAuthenticated) {
    //   const userClaims = await this.oktaAuth.getUser();
    //   this.userFullName = userClaims.name as string;
    // }
  }

  logout() {
    this.oktaAuth.signOut();
  }
}
