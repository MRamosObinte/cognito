import { Injectable } from "@angular/core";
import { Callback, CognitoUtil } from "./cognito.service";
import * as AWS from "aws-sdk/global";

@Injectable()
export class AwsUtil {
    public static primerLogin: boolean = false;
    public static corriendoInit: boolean = false;

    constructor(public cognitoUtil: CognitoUtil) {
        AWS.config.region = CognitoUtil._REGION;
    }

    initAwsService(callback: Callback, estaLogueado: boolean, idToken: string) {
        if (AwsUtil.corriendoInit) {//revisamos si ya se esta ejecutando
            if (callback != null) {
                callback.callback();
                callback.callbackWithParam(null);
            }
            return;
        }
        AwsUtil.corriendoInit = true;
        if (estaLogueado)
            this.setupAWS(estaLogueado, callback, idToken);
    }

    setupAWS(estaLogueado: boolean, callback: Callback, idToken: string): void {
        if (estaLogueado) {
            this.addCognitoCredentials(idToken);
        }
        if (callback != null) {
            callback.callback();
            callback.callbackWithParam(null);
        }
        AwsUtil.corriendoInit = false;
    }

    addCognitoCredentials(idTokenJwt: string): void {
        let creds = this.cognitoUtil.buildCognitoCreds(idTokenJwt);
        AWS.config.credentials = creds;
        creds.get(function (err) {
            if (!err) {
                if (AwsUtil.primerLogin) {
                    AwsUtil.primerLogin = false;
                }
            }
        });
    }

    static getCognitoParametersForIdConsolidation(idTokenJwt: string): {} {
        let url = 'cognito-idp.' + CognitoUtil._REGION.toLowerCase() + '.amazonaws.com/' + CognitoUtil._USER_POOL_ID;
        let logins: Array<string> = [];
        logins[url] = idTokenJwt;
        let params = {
            IdentityPoolId: '', /* required */
            Logins: logins
        };
        return params;
    }

}
