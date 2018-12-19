import { Component, OnInit } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';
// import { DbService } from '../services/db.service';
// import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { FbaseService } from '../services/fbase.service';
import { database } from 'firebase';
import { Contact } from '../models/contact';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  contacts: any = [];
  contact: any;
  constructor(
    private navCtrl: NavController,
    // private db: DbService,
    private fb: FbaseService,
    // private sqlite: SQLite,
    private platform: Platform) {
    this.navCtrl.navigateRoot('/home');
  }

  ngOnInit(): void {
    // this.platform.ready().then(() => {
    // this.db.getContacts();

    this.fb.getAllContacts().subscribe(snapshot => {
      snapshot.forEach(doc => {
        this.contact = doc.data();
        this.contact.id = doc.id;
        this.contacts.push(this.contact);
      })
    });
  }

  delete(id) {
    this.fb.deleteContact(id);
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
