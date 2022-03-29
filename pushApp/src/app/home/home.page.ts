import { Component } from '@angular/core';

import { Platform, ToastController } from '@ionic/angular';
import { FcmService } from '../services/fcm.service';
import { Clipboard } from '@capacitor/clipboard';
import { PushNotifications, Token } from '@capacitor/push-notifications';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  token: string = this.fcm.DEFAULT_TOKEN;

  constructor(
    private fcm: FcmService,
    private platform: Platform,
    private toastController: ToastController
  ) {
    this.platform.ready().then(() => {
      this.fcm.init();
      this.fcm.token.subscribe(token => {
        this.token = token
      })
    });
  }

  async copy() {
    await Clipboard.write({
      string: this.token,
    });
    await this.presentToast();
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Copied to clipboard!',
      duration: 2000,
    });
    toast.present();
  }
}
