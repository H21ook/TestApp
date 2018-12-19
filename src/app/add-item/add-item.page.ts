import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
// import { DbService } from '../services/db.service';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { ActivatedRoute } from '@angular/router';
import * as firebase from 'firebase';
import { FbaseService } from '../services/fbase.service';

@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.page.html',
  styleUrls: ['./add-item.page.scss'],
})
export class AddItemPage implements OnInit {

  contact: any = {};
  id: any = null;
  isRead: boolean = false;
  constructor(
    private alertController: AlertController,
    private navCtrl: NavController,
    // private db: DbService,
    private fb: FbaseService,
    private camera: Camera,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.isRead = true;
      // this.db.getContact(this.id);
      // this.contact = this.db.contact;

      this.fb.getContact(this.id).subscribe(snapshot => {
        this.contact = snapshot;
        this.contact.id = this.id;
        if (this.contact.img)
          this.loadImage(this.contact.img);
      });
    } else {
      this.isRead = false;
    }


  }

  loadImage(imageName) {
    var storageRef = firebase.storage().ref(imageName);
    storageRef.getDownloadURL().then((url) => {
      this.contact.img = url;
    });
  }

  takePhoto() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      saveToPhotoAlbum: false,
      allowEdit: true,
      targetWidth: 300,
      targetHeight: 300
    }

    this.camera.getPicture(options).then((imageData) => {
      this.contact.img = 'data:image/jpeg;base64,' + imageData;
    }, (err) => {
    });
  }

  getImage() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      saveToPhotoAlbum: false,
      allowEdit: true,
      targetWidth: 300,
      targetHeight: 300
    }

    this.camera.getPicture(options).then((imageData) => {
      this.contact.img = 'data:image/jpeg;base64,' + imageData;
    }, (err) => {
    });
  }

  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      header: 'Баталгаажуулалт!',
      message: 'Буцахдаа итгэлтэй байна уу?',
      buttons: [
        {
          text: 'Үгүй',
          role: 'cancel',
          cssClass: 'primary',
          handler: (blah) => {

          }
        }, {
          text: 'Тийм',
          handler: () => {
            this.navCtrl.goBack(true);
          }
        }
      ]
    });
    await alert.present();
  }

  async presentPhoto() {
    const alert = await this.alertController.create({
      header: undefined,
      animated: true,
      cssClass: 'alertPhoto',
      message: '<ion-row align-items-center justify-content-center><ion-icon size="large" color="dark" name="images"></ion-icon><h4> Add photo</h4></ion-row>',
      buttons: [
        {
          text: 'Take',
          handler: () => {
            this.takePhoto();
          }
        }, {
          text: 'Upload',
          handler: () => {
            this.getImage();
          }
        }
      ]
    });
    await alert.present();
  }

  save() {
    if (this.id) {
      this.fb.updateContact(this.contact);
    } else {
      this.fb.createContact(this.contact);
    }
    // this.alert(
    //   "fn" + this.contact.firstname + "\n" +
    //   "ln" + this.contact.lastname + "\n", "OK");
    // this.db.addContact(this.contact);
    // this.db.getContacts();
    this.navCtrl.navigateBack('/home');
  }

  edit() {
    this.isRead = false;
  }

  async alert(msg: string, btnText: string, headerMsg?: string, subHeaderMsg?: string) {
    const alert = await this.alertController.create({
      header: headerMsg,
      subHeader: subHeaderMsg,
      message: msg,
      buttons: [btnText]
    });
    await alert.present();
  }
}
