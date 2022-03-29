import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import {
  ActionPerformed,
  PushNotificationSchema,
  PushNotifications,
  Token,
} from '@capacitor/push-notifications';
import { BehaviorSubject, from } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FcmService {
  public DEFAULT_TOKEN = 'No token';
  public token = new BehaviorSubject(this.DEFAULT_TOKEN);

  constructor(private platform: Platform) {}

  init() {
    if (!this.platform.is('capacitor')) {
      console.log("App running from web browser. Won't connect to firebase");
      return;
    }

    PushNotifications.requestPermissions().then((result) => {
      // Request permission to use push notifications. In Android, this defaults to 'granted'
      if (result.receive === 'granted') {
        console.log('Starting firebase register');
        PushNotifications.register();
      }
    });

    // Triggered by PushNotifications.register()
    PushNotifications.addListener('registration', (token: Token) => {
      console.log('Push registration success, token: ' + token.value);
      this.token.next(token.value);
    });

    // Triggered when 'registration' listener fails
    PushNotifications.addListener('registrationError', (error: any) => {
      console.log('Error on registration: ' + JSON.stringify(error));
    });

    // Triggered when a notification is received and the app is open
    PushNotifications.addListener(
      'pushNotificationReceived',
      (notification: PushNotificationSchema) => {
        console.log(
          'Push notification received: ' + JSON.stringify(notification)
        );
      }
    );

    // Triggered when tapping on a notification
    PushNotifications.addListener(
      'pushNotificationActionPerformed',
      (notification: ActionPerformed) => {
        console.log(
          console.log('Push action performed: ' + JSON.stringify(notification))
        );
      }
    );
  }
}
