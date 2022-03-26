import { Component, Inject, OnInit } from '@angular/core';
import { OKTA_AUTH } from '@okta/okta-angular';
import { OktaAuth, Tokens } from '@okta/okta-auth-js';
import * as OktaSignIn from '@okta/okta-signin-widget';

import myAppConfig from 'src/app/config/my-app-config';

const DEFAULT_ORIGINAL_URI = window.location.origin;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  oktaSignIn: any;

  constructor(@Inject(OKTA_AUTH) public oktaAuth: OktaAuth) {
    this.oktaSignIn = new OktaSignIn({
      logo: 'assets/images/logo.png',
      baseUrl: myAppConfig.oidc.issuer.split('/oauth2')[0],
      clientId: myAppConfig.oidc.clientId,
      redirectUri: myAppConfig.oidc.redirectUri,
      authParams: {
        pkce: true,
        issuer: myAppConfig.oidc.issuer,
        scopes: myAppConfig.oidc.scopes,
      },
      authClient: oktaAuth,
    });
  }

  ngOnInit(): void {
    const originalUri = this.oktaAuth.getOriginalUri();
    if (!originalUri || originalUri === DEFAULT_ORIGINAL_URI) {
      this.oktaAuth.setOriginalUri('/');
    }

    this.oktaSignIn
      .showSignInToGetTokens({
        el: '#okta-sign-in-widget',
        scopes: myAppConfig.oidc.scopes,
      })
      .then((tokens: Tokens) => {
        this.oktaSignIn.remove();

        this.oktaAuth.handleLoginRedirect(tokens);
      })
      .catch((err: any) => {
        throw err;
      });
  }

  ngOnDestroy() {
    this.oktaSignIn.remove();
  }
}
