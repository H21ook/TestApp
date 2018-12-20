import { Component, OnInit } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { ActivatedRoute } from '@angular/router';
import * as firebase from 'firebase';
import { FbaseService } from '../services/fbase.service';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { SMS } from '@ionic-native/sms/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { Contact } from '../models/contact';
import { ListDataService } from '../services/list-data.service';

@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.page.html',
  styleUrls: ['./add-item.page.scss'],
})
export class AddItemPage implements OnInit {

  private contact: any = {};
  private id: any = null;
  private isRead: boolean = false;
  private displayName: string = '';
  private isUpdated: boolean = false;
  private device: number;
  constructor(
    private alertController: AlertController,
    private navCtrl: NavController,
    private fb: FbaseService,
    private camera: Camera,
    private callNumber: CallNumber,
    private platform: Platform,
    private route: ActivatedRoute,
    private socialSharing: SocialSharing,
    private listDataService: ListDataService
  ) {
  }

  ngOnInit() {
    this.platform.ready().then(() => {
      this.id = this.route.snapshot.paramMap.get('id');
      this.getContact(this.id);
      this.device = this.getDevice();
    });

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

  private getContact(id) {
    if (id) {
      this.isRead = true;
      this.fb.getContact(id).subscribe(snapshot => {
        this.contact = snapshot;
        this.contact.id = id;
        if (this.contact.img)
          this.loadImage(this.contact.img);
        this.displayName = this.listDataService.setDisplayName(this.contact);
      });
    } else {
      this.isRead = false;
    }
  }

  loadImage(imageName) {
    if (imageName) {
      var storageRef = firebase.storage().ref(imageName);
      storageRef.getDownloadURL().then((url) => {
        this.contact.img = url;
      });
    }
  }

  edit() {
    this.isRead = false;
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

  uploadImage() {
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

  // async presentAlertConfirm() {
  //   const alert = await this.alertController.create({
  //     header: 'Баталгаажуулалт!',
  //     message: 'Буцахдаа итгэлтэй байна уу?',
  //     buttons: [
  //       {
  //         text: 'Үгүй',
  //         role: 'cancel',
  //         cssClass: 'primary',
  //         handler: (blah) => {

  //         }
  //       }, {
  //         text: 'Тийм',
  //         handler: () => {
  //           this.navCtrl.goBack(true);
  //         }
  //       }
  //     ]
  //   });
  //   await alert.present();
  // }

  async presentPhoto() {
    if (!this.isRead) {
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
              this.uploadImage();
            }
          }
        ]
      });
      await alert.present();
    }
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

  delete(): void {
    this.fb.deleteContact(this.id);
    this.navCtrl.navigateRoot('/home');
  }

  save(): void {
    if (this.id) {
      this.fb.updateContact(this.contact);
    } else {
      this.fb.createContact(this.contact);
    }
    this.navCtrl.navigateBack('/home');
  }

  call(): void {
    console.log("call");
    if (this.device < 4)
      if (this.contact.phonenumber)
        this.callNumber.callNumber(this.contact.phonenumber, true)
          .then(res =>
            console.log('Launched dialer!', res))
          .catch(err =>
            console.log('Error launching dialer', err));

  }

  message(): void {
    console.log("message");
    if (this.device < 4)
      if (this.contact.phonenumber) {
        this.socialSharing.shareViaSMS('', this.contact.phonenumber);
      }
  }
}
