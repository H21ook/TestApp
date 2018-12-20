import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { Contact } from '../models/contact';
import { Platform, AlertController } from '@ionic/angular';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DbService {

  contacts: any = [];
  contact: any;

  constructor(
    public sqlite: SQLite,
    private platform: Platform,
    private alertController: AlertController
  ) {
    this.platform.ready().then(() => {
      this.createContactTable();
    });
  }

  createContactTable() {
    this.sqlite.create({
      name: 'data.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('CREATE TABLE IF NOT EXISTS contact(' +
        'id integer primary key autoincrement, ' +
        'img text, ' +
        'firstname NVARCHAR(50), ' +
        'lastname NVARCHAR(50), ' +
        'companyname NVARCHAR(50), ' +
        'phonenumber numeric(30, 0), ' +
        'email NVARCHAR(100))', [])
        .then(() => console.log('Executed SQL'))
        .catch(e => console.log(e));
    }).catch(e => {
      console.log(e);
    });
  }

  addContact(contact: Contact) {
    this.sqlite.create({ name: 'data.db', location: 'default' })
      .then((db: SQLiteObject) => {
        db.executeSql('INSERT INTO contact VALUES(null,?,?,?,?,?,?)',
          [
            contact.img,
            contact.firstname,
            contact.lastname,
            contact.companyname,
            contact.phonenumber,
            contact.email
          ])
          .then(res => {
            console.log(res);
          })
          .catch(e => {
            console.log(e);
          });
      }).catch(e => {
        console.log(e);
      });
  }

  getContacts() {
    return new Promise(resolve => {
      this.sqlite.create({ name: 'data.db', location: 'default' })
        .then((db: SQLiteObject) => {
          db.executeSql('SELECT * FROM contact', [])
            .then(res => {
              for (var i = 0; i < res.rows.length; i++) {
                this.contacts.push({
                  id: res.rows.item(i).id,
                  img: res.rows.item(i).img,
                  firstname: res.rows.item(i).firstname,
                  lastname: res.rows.item(i).lastname,
                  companyname: res.rows.item(i).companyname,
                  phonenumber: res.rows.item(i).phonenumber,
                  email: res.rows.item(i).email
                })
                resolve(this.contacts);
              }
            })
            .catch(e => {
              console.log(e);
            });
        }).catch(e => {
          console.log(e);
        });
    });
  }

  getContact(id) {
    this.sqlite.create({ name: 'data.db', location: 'default' })
      .then((db: SQLiteObject) => {
        db.executeSql('SELECT * FROM contact where id =' + id, [])
          .then(res => {
            if (res.rows.length > 0) {
              this.contacts = {
                id: res.rows.item(0).id,
                img: res.rows.item(0).img,
                firstname: res.rows.item(0).firstname,
                lastname: res.rows.item(0).lastname,
                companyname: res.rows.item(0).companyname,
                phonenumber: res.rows.item(0).phonenumber,
                email: res.rows.item(0).email
              }
            }
          })
          .catch(e => {
            console.log(e);
          });
      }).catch(e => {
        console.log(e);
      });
  }

  deleteContact(id) {
    this.sqlite.create({ name: 'data.db', location: 'default' })
      .then((db: SQLiteObject) => {
        db.executeSql('DELETE FROM contact where id =' + id, [])
          .then(() => {
            console.log("Deleted id:" + id + " contact");
          })
          .catch(e => {
            console.log(e);
          });
      }).catch(e => {
        console.log(e);
      });
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
