import { Component, OnInit } from '@angular/core';
import {
  ActionPerformed,
  PushNotificationSchema,
  PushNotifications,
  Token,
} from '@capacitor/push-notifications';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  private messages: string[] = [];

  constructor(private platform: Platform) {}

  ngOnInit(): void {
    if (this.platform.is('capacitor')) {
      this.setUpNotifications();
    } else {
      let message = 'App running from web browser';
      this.messages.push(message);
      console.log(message);
      message = "Won't use notifications";
      this.messages.push(message);
      console.log(message);
    }
  }

  writeMessage(message) {
    this.messages.push(message);
    console.log(message);
  }

  setUpNotifications() {
    PushNotifications.requestPermissions().then((result) => {
      // Request permission to use push notifications. In Android, this defaults to 'granted'
      if (result.receive === 'granted') {
        this.writeMessage('Starting firebase register');
        PushNotifications.register();
      }
    });

    // Triggered by PushNotifications.register()
    PushNotifications.addListener('registration', (token: Token) => {
      this.writeMessage('Push registration success, token: ' + token.value);
    });

    // Triggered when 'registration' listener fails
    PushNotifications.addListener('registrationError', (error: any) => {
      this.writeMessage('Error on registration: ' + JSON.stringify(error));
    });

    // Triggered when a notification is received and the app is open
    PushNotifications.addListener(
      'pushNotificationReceived',
      (notification: PushNotificationSchema) => {
        this.writeMessage(
          'Push notification received: ' + JSON.stringify(notification)
        );
      }
    );

    // Triggered when tapping on a notification
    PushNotifications.addListener(
      'pushNotificationActionPerformed',
      (notification: ActionPerformed) => {
        this.writeMessage(
          console.log('Push action performed: ' + JSON.stringify(notification))
        );
      }
    );
  }
}
