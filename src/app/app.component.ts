import { Component, OnInit } from "@angular/core";
import { AwsUtil } from "./service/aws.service";
import { UserLoginService } from "./service/user-login.service";
import { CognitoUtil, LoggedInCallback } from "./service/cognito.service";

@Component({
    selector: 'app-root',
    templateUrl: 'template/app.html'
})
export class AppComponent implements OnInit, LoggedInCallback {

    constructor(public awsUtil: AwsUtil, public userService: UserLoginService, public cognito: CognitoUtil) {
    }

    ngOnInit() {
        this.userService.isAuthenticated(this);
    }

    estaLogueado(message: string, estaLogueado: boolean) {
        let mythis = this;
        this.cognito.getIdToken({
            callback() {
            },
            callbackWithParam(token: any) {
                mythis.awsUtil.initAwsService(null, estaLogueado, token);
            }
        });
    }
}

