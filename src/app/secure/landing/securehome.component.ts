import {Component, OnInit} from "@angular/core";
import {Router} from "@angular/router";
import {UserLoginService} from "../../service/user-login.service";
import {LoggedInCallback} from "../../service/cognito.service";

@Component({
    selector: 'awscognito-angular2-app',
    templateUrl: './secureHome.html'
})
export class SecureHomeComponent implements OnInit, LoggedInCallback {

    constructor(public router: Router, public userService: UserLoginService) {
        this.userService.isAuthenticated(this);
    }

    ngOnInit() {
    }

    estaLogueado(message: string, estaLogueado: boolean) {
        if (!estaLogueado) {
            this.router.navigate(['/home/login']);
        }
    }
}

