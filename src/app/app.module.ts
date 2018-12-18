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


@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    AngularFireModule,
    AngularFireDatabaseModule,
    AngularFirestoreModule,
    AngularFireModule.initializeApp(FIREBASE_CONFIG),
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Camera,
    // SQLite,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    // DbService,
    FbaseService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
