import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { FcmService } from '../services/fcm.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  constructor(private fcm: FcmService, private platform: Platform) {
    this.platform.ready().then(() => {
      this.fcm.init();
    });
  }
}
