import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class FbaseService {

  constructor(private afs: AngularFirestore) { }

  getAllContacts() {
    return this.afs.collection('/contacts').get();
  }

  getContact(id) {
    return this.afs.collection('/contacts').doc(id).valueChanges();
  }

  deleteContact(id) {
    this.afs.collection('/contacts').doc(id).delete().then(() => {
      console.log("Document successfully deleted!");
    }, err => console.log("Delete ERROR: ", err));
  }

  updateContact(contact) {
    this.afs.collection('/contacts').doc(contact.id).update(contact).then(() => {
      console.log("Document successfully updated!", contact.id);
    }, err => console.log("Update ERROR: ", err));
  }

  createContact(contact) {
    this.afs.collection('/contacts').add(contact).then(newContact => {
      if (contact.img) {
        const picture = firebase.storage().ref('contacts/image_' + newContact.id);
        picture.putString(contact.img, 'data_url');
      }
      console.log("Document successfully created!", newContact.id);
    }, err => console.log("Create ERROR: ", err));
  }
}
