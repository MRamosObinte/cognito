import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { UserLoginService } from "../../../service/user-login.service";
import { ChallengeParameters, CognitoCallback, LoggedInCallback } from "../../../service/cognito.service";

@Component({
    selector: 'awscognito-angular2-app',
    templateUrl: './login.html'
})
export class LoginComponent implements CognitoCallback, LoggedInCallback, OnInit {

    email: string;
    password: string;
    errorMessage: string;
    mfaStep = false;
    mfaData = {
        destination: '',
        callback: null
    };

    constructor(public router: Router,
        public userService: UserLoginService
    ) {
    }

    ngOnInit() {
        this.errorMessage = null;
        this.userService.isAuthenticated(this);
    }

    onLogin() {
        if (this.email == null || this.password == null) {
            this.errorMessage = "All fields are required";
            return;
        }
        this.errorMessage = null;
        this.userService.authenticate(this.email, this.password, this);
    }

    cognitoCallback(message: string, result: any) {
        if (message != null) { //error
            this.errorMessage = message;
            if (this.errorMessage === 'User is not confirmed.') {
                this.router.navigate(['/home/confirmRegistration', this.email]);
            } else if (this.errorMessage === 'User needs to set password.') {
                this.router.navigate(['/home/newPassword']);
            }
        } else { //success
            this.router.navigate(['/securehome']);
        }
    }

    handleMFAStep(challengeName: string, challengeParameters: ChallengeParameters, callback: (confirmationCode: string) => any): void {
        this.mfaStep = true;
        this.mfaData.destination = challengeParameters.CODE_DELIVERY_DESTINATION;
        this.mfaData.callback = (code: string) => {
            if (code == null || code.length === 0) {
                this.errorMessage = "Code is required";
                return;
            }
            this.errorMessage = null;
            callback(code);
        };
    }

    estaLogueado(message: string, estaLogueado: boolean) {
        if (estaLogueado) {
            this.router.navigate(['/securehome']);
        }
    }

    cancelMFA(): boolean {
        this.mfaStep = false;
        return false;   //necessary to prevent href navigation
    }
    
}
