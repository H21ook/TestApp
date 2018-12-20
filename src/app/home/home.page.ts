import { Component, OnInit } from '@angular/core';
import { NavController, Platform, Searchbar } from '@ionic/angular';
import { FbaseService } from '../services/fbase.service';
import { ListDataService } from '../services/list-data.service';
import { DbService } from '../services/db.service';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage implements OnInit {

  private groups: any = [];
  private device: number;
  private search: string;
  private contacts: any;
  private result: any = [];

  constructor(
    private navCtrl: NavController,
    private fb: FbaseService,
    private platform: Platform,
    private db: DbService,
    private listDataService: ListDataService) {
    this.platform.ready().then(() => {
      this.device = this.getDevice();
    });
  }

  ngOnInit(): void {
    this.getAllContact();
    this.fb.getAllContacts().then(data => {
      this.contacts = data;
      for (let i = 0; i < this.contacts.length; i++)
        this.contacts[i].displayName = this.listDataService.setDisplayName(this.contacts[i]);
    });

    console.log(this.db.getContacts());
  }

  getDevice(): number {
    if (this.platform.is('ios'))
      return 1;
    else if (this.platform.is('android'))
      return 2;
    else if (this.platform.is('mobile') || this.platform.is('cordova') || this.platform.is('iphone') || this.platform.is('tablet'))
      return 3;
    else
      return 4;
  }

  getAllContact() {
    this.listDataService.sortList(this.fb.isUpdated).then(contacts => {
      this.groups = contacts;
    });
  }

  searching() {
    if (!this.search) {
      this.result = this.contacts;
    } else {
      this.result = [];
      this.contacts.filter(x => {
        if (x.displayName.trim().toLowerCase().includes(this.search.trim().toLowerCase())) {
          this.result.push(x);
        }
      });
      this.listDataService.sortList(true, this.result).then(data => {
        this.result = data;
      });
    }
  }
  // async presentModal() {
  //   const modal = await this.modalController.create({
  //     component: AddItemPage,
  //     animated: true,
  //     backdropDismiss: true,
  //     showBackdrop: true
  //   });
  //   return await modal.present();
  // }

  goToAddItem() {
    this.navCtrl.navigateRoot('/additem');
  }
}
