import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class FbaseService {
  contacts: any = [];
  contact: any;
  isUpdated = false;
  constructor(private afs: AngularFirestore) { }

  getAllContacts() {
    this.isUpdated = false;
    return new Promise(resolve => {
      this.afs.collection('/contacts').get().subscribe(snapshot => {
        let tcontacts: any = [];
        snapshot.forEach(doc => {
          let tcontact: any;
          tcontact = doc.data();
          tcontact.id = doc.id;
          tcontacts.push(tcontact);
        })
        this.contacts = tcontacts;
        resolve(this.contacts);
      });
    });
  }

  getContact(id) {
    this.isUpdated = false;
    return this.afs.collection('/contacts').doc(id).valueChanges();
  }

  deleteContact(id) {
    this.isUpdated = true;
    this.afs.collection('/contacts').doc(id).delete().then(() => {
      console.log("Document successfully deleted!", id);
    }, err => console.log("Delete ERROR: ", err));
  }

  updateContact(contact) {
    this.isUpdated = true;
    this.afs.collection('/contacts').doc(contact.id).update(contact).then(() => {
      console.log("Document successfully updated!", contact.id);
    }, err => console.log("Update ERROR: ", err));
  }

  createContact(contact) {
    this.isUpdated = true;
    this.afs.collection('/contacts').add(contact).then(newContact => {
      if (contact.img) {
        const picture = firebase.storage().ref('contacts/image_' + newContact.id);
        picture.putString(contact.img, 'data_url');
      }
      console.log("Document successfully created!", newContact.id);
    }, err => console.log("Create ERROR: ", err));
  }
}
