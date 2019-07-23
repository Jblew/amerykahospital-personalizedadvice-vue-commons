// tslint:disable:ordered-imports

import firebase from "firebase/app";
import "firebase/firestore";
import firebaseui from "firebaseui";

import { FirestoreCollections, FIREBASE_CONFIG } from "amerykahospital-personalizedadvice-core";

export class FirebaseAuthHelper {
    public static initialize(opts: FirebaseAuthHelper.InitializeOptions) {
        firebase.initializeApp(FIREBASE_CONFIG);
        firebase.auth().onAuthStateChanged((user: FirebaseAuthHelper.User | null) => {
            if (user) {
                opts.authenticatedCb(user);
            } else {
                opts.notAuthenticatedCb();
            }
        });
    }

    public static async signOut() {
        await firebase.auth().signOut();
    }

    public static getSignInProviders(): string[] {
        return [/*firebase.auth.GoogleAuthProvider.PROVIDER_ID,*/ firebase.auth.EmailAuthProvider.PROVIDER_ID];
    }

    public static doAuth(): firebase.auth.Auth {
        return firebase.auth();
    }

    public static startFirebaseAuthUI(id: string, signInSuccessfulUrl: string) {
        const uiConfig = {
            signInSuccessUrl: signInSuccessfulUrl,
            signInOptions: FirebaseAuthHelper.getSignInProviders(),
        };
        FirebaseAuthHelper.UI_INSTANCE =
            FirebaseAuthHelper.UI_INSTANCE || new firebaseui.auth.AuthUI(FirebaseAuthHelper.doAuth());
        FirebaseAuthHelper.UI_INSTANCE.start(id, uiConfig);
    }

    public static async checkIfUserIsConfirmedMedicalProfessional(uid: string) {
        const res = await firebase
            .firestore()
            .collection(FirestoreCollections.MEDICALPROFESSIONAL_UIDS_COLLECTION)
            .doc(uid)
            .get();
        return res.exists;
    }

    private static UI_INSTANCE: firebaseui.auth.AuthUI | undefined = undefined;
}

export namespace FirebaseAuthHelper {
    export interface InitializeOptions {
        authenticatedCb: (user: FirebaseAuthHelper.User) => void;
        notAuthenticatedCb: () => void;
    }

    export type User = firebase.User;
}
