import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { UserRegistrationService } from "../../../service/user-registration.service";
import { CognitoCallback } from "../../../service/cognito.service";

export class RegistrationUser {
    name: string;
    email: string;
    phone_number: string;
    password: string;
}

@Component({
    selector: 'awscognito-angular2-app',
    templateUrl: './registration.html'
})
export class RegisterComponent implements CognitoCallback {
    registrationUser: RegistrationUser;
    router: Router;
    errorMessage: string;

    constructor(public userRegistration: UserRegistrationService, router: Router) {
        this.router = router;
        this.onInit();
    }

    onInit() {
        this.registrationUser = new RegistrationUser();
        this.errorMessage = null;
    }

    onRegister() {
        this.errorMessage = null;
        this.userRegistration.register(this.registrationUser, this);
    }

    cognitoCallback(message: string, result: any) {
        if (message != null) { //error
            this.errorMessage = message;
        } else { //success
            this.router.navigate(['/home/confirmRegistration', result.user.username]);
        }
    }
}
