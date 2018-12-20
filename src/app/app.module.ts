import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { SQLite } from '@ionic-native/sqlite/ngx';
// import { DbService } from './services/db.service';
import { Camera } from '@ionic-native/camera/ngx';

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFirestoreModule } from 'angularfire2/firestore';
// import { AngularFirestoreModule } from '@angular/fire/firestore';
import { FIREBASE_CONFIG } from './services/firebase.config';
import { FbaseService } from './services/fbase.service';
import { IonicStorageModule } from '@ionic/storage';
import { HttpClientModule } from '@angular/common/http';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { ListDataService } from './services/list-data.service';
import { DbService } from './services/db.service';


@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    IonicStorageModule.forRoot(),
    AppRoutingModule,
    AngularFireModule,
    HttpClientModule,
    AngularFireDatabaseModule,
    AngularFirestoreModule,
    AngularFireModule.initializeApp(FIREBASE_CONFIG),
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Camera,
    CallNumber,
    SocialSharing,
    SQLite,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    DbService,
    FbaseService,
    ListDataService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
