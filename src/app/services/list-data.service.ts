import { Injectable } from '@angular/core';
import { FbaseService } from './fbase.service';

@Injectable({
  providedIn: 'root'
})
export class ListDataService {
  contacts: any;
  contact: any;
  dNames: string[] = [];
  constructor(private fb: FbaseService) {
    // this.sortList();
  }

  setDisplayName(contact): string {
    if (contact.firstname && contact.lastname) {
      return contact.lastname + " " + contact.firstname;
    }
    else {
      if (!contact.firstname) {
        if (!contact.lastname) {
          if (!contact.companyname) {
            if (!contact.phonenumber) {
              return contact.email;
            } else {
              return contact.phonenumber;
            }
          } else {
            return contact.companyname;
          }
        } else {
          return contact.lastname;
        }
      } else {
        return contact.firstname;
      }
    }
  }

  getDisplayName(cs?) {
    if (cs)
      for (let i = 0; i < cs.length; i++) {
        this.dNames.push(this.setDisplayName(cs[i]));
        cs[i].displayName = this.setDisplayName(cs[i]);
      }
    else
      for (let i = 0; i < this.contacts.length; i++) {
        this.dNames.push(this.setDisplayName(this.contacts[i]));
        this.contacts[i].displayName = this.setDisplayName(this.contacts[i]);
      }
  }

  sortList(isUpdated, cs?) {
    if (!isUpdated && this.contacts) {
      return new Promise(resolve => {
        resolve(this.contacts);
      });
    }
    else if (cs) {
      return new Promise(resolve => {
        let css: any = cs;
        this.getDisplayName(cs);
        for (let i = 0; i < this.dNames.length; i++) {
          for (let j = 0; j < this.dNames.length - 1; j++) {
            if (this.dNames[j].toUpperCase().localeCompare(this.dNames[j + 1].toUpperCase()) > -1) {
              let tContact = JSON.parse(JSON.stringify(css[j]));
              let temp = JSON.parse(JSON.stringify(this.dNames[j]));
              css[j] = JSON.parse(JSON.stringify(css[j + 1]));
              this.dNames[j] = JSON.parse(JSON.stringify(this.dNames[j + 1]));
              css[j + 1] = JSON.parse(JSON.stringify(tContact));
              this.dNames[j + 1] = JSON.parse(JSON.stringify(temp));
            }
          }
        }
        css = this.groupList(css);
        resolve(css);
      })
    }
    else {
      return new Promise(resolve => {
        this.fb.getAllContacts().then(contacts => {
          this.contacts = contacts;
          this.getDisplayName();
          for (let i = 0; i < this.dNames.length; i++) {
            for (let j = 0; j < this.dNames.length - 1; j++) {
              if (this.dNames[j].toUpperCase().localeCompare(this.dNames[j + 1].toUpperCase()) > -1) {
                let tContact = JSON.parse(JSON.stringify(this.contacts[j]));
                let temp = JSON.parse(JSON.stringify(this.dNames[j]));
                this.contacts[j] = JSON.parse(JSON.stringify(this.contacts[j + 1]));
                this.dNames[j] = JSON.parse(JSON.stringify(this.dNames[j + 1]));
                this.contacts[j + 1] = JSON.parse(JSON.stringify(tContact));
                this.dNames[j + 1] = JSON.parse(JSON.stringify(temp));
              }
            }
          }
          this.groupList();
          resolve(this.contacts);
        })
      });
    }
  }

  groupList(css?) {
    if (css) {
      let temp: any = [];
      let groupContacts = [];

      for (let i = 0; i < css.length; i++) {
        temp.push(css[i].displayName.toString().substring(0, 1).toUpperCase());
      }

      for (let i = 0; i < css.length; i++) {
        let groupContact: any = {};
        let _contact: any = [];
        let jump = false;

        if (i == 0) {
          groupContact.name = temp[i];
          _contact.push(css[i]);
        } else {
          for (let j = 0; j < i; j++) {
            if (temp[i] == temp[j]) {
              jump = true;
            }
          }
          if (!jump) {
            groupContact.name = temp[i];
            _contact.push(css[i]);
          }
        }
        if (!jump) {
          for (let j = i + 1; j < css.length; j++) {
            if (temp[i] == temp[j]) {
              _contact.push(css[j]);
            }
          }
          groupContact.contacts = _contact;
          groupContacts.push(groupContact);
        }

      }
      this.dNames = [];
      return groupContacts;
    }
    else {
      let temp: any = [];
      let groupContacts = [];

      for (let i = 0; i < this.contacts.length; i++) {
        temp.push(this.contacts[i].displayName.toString().substring(0, 1).toUpperCase());
      }

      for (let i = 0; i < this.contacts.length; i++) {
        let groupContact: any = {};
        let _contact: any = [];
        let jump = false;

        if (i == 0) {
          groupContact.name = temp[i];
          _contact.push(this.contacts[i]);
        } else {
          for (let j = 0; j < i; j++) {
            if (temp[i] == temp[j]) {
              jump = true;
            }
          }
          if (!jump) {
            groupContact.name = temp[i];
            _contact.push(this.contacts[i]);
          }
        }
        if (!jump) {
          for (let j = i + 1; j < this.contacts.length; j++) {
            if (temp[i] == temp[j]) {
              _contact.push(this.contacts[j]);
            }
          }
          groupContact.contacts = _contact;
          groupContacts.push(groupContact);
        }

      }
      this.dNames = [];
      this.contacts = groupContacts;
    }
  }
}
