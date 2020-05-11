import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { SwUpdate } from '@angular/service-worker';
import { Plugins } from '@capacitor/core';
const { Modals } = Plugins;

@Component({
  selector: 'app',
  templateUrl: 'app.component.html'
})

export class AppComponent implements OnInit {

  constructor(private titleService: Title, private swUpdate: SwUpdate) {
    this.titleService.setTitle('ColoradoCareExchange');
  }

  ngOnInit() {
    if (this.swUpdate.isEnabled) {

      this.swUpdate.available.subscribe(async () => {
        const confirmReload = await Modals.confirm({
          title: 'A new version of the app is available.',
          message: 'A new version of the app is available. Would you like to load it now?'
        });
        if (confirmReload) {
          window.location.reload();
        }
      });
    }
  }
}
