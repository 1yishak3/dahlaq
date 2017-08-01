import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule, Http } from '@angular/http';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import * as firebase from 'firebase'
//var dFire = firebase.initializeApp(environment.firebase)
import 'firebase/auth'
import 'firebase/messaging'
import 'firebase/database'
import 'firebase/storage'
//import{ AngularFireModule } from 'angularfire2'
//import { AngularFireDatabaseModule } from 'angularfire2/database'
//import { AngularFireAuthModule } from 'angularfire2/auth'
//import { AngularFireMessaginModule } from 'angularfire2/messaging'
//import { AngularFireStorageModule } from 'angularfire2/auth';
//import ionicMaterial from '../../bower_components/ionic-material/dist/ionic.material'
import { Storage, IonicStorageModule } from '@ionic/storage';
import { ElasticModule } from 'angular2-elastic'
import { AutosizeModule } from 'ionic2-autosize'
import { environment } from '../environments/environment'

import { MyApp } from './app.component';

import { CardsPage } from '../pages/cards/cards';
import { ChatPage } from '../pages/chat-detail/chat-detail';
import { ItemCreatePage } from '../pages/item-create/item-create';
import { ItemDetailPage } from '../pages/item-detail/item-detail';
import { ListMasterPage } from '../pages/list-master/list-master';
import { LoginPage } from '../pages/login/login';
import { MapPage } from '../pages/map/map';
import { MenuPage } from '../pages/menu/menu';
import { SearchPage } from '../pages/search/search';
import { SettingsPage } from '../pages/settings/settings';
import { SignupPage } from '../pages/signup/signup';
import { TabsPage } from '../pages/tabs/tabs';
import { TutorialPage } from '../pages/tutorial/tutorial';
import { WelcomePage } from '../pages/welcome/welcome';
import { PostPage } from '../pages/post/post'

import { Api } from '../providers/api';
import { Items } from '../mocks/providers/items';
import { Settings } from '../providers/settings';
import { User } from '../providers/user';
import { FirebaseService } from '../providers/firebase'

import { Camera } from '@ionic-native/camera';
import { GoogleMaps } from '@ionic-native/google-maps';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
//import { LueggModule } from 'angularjs-scroll-glue'

// The translate loader needs to know where to load i18n files
// in Ionic's static asset pipeline.
export function HttpLoaderFactory(http: Http) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export function provideSettings(storage: Storage) {
  /**
   * The Settings provider takes a set of default settings for your app.
   *
   * You can add new settings options at any time. Once the settings are saved,
   * these values will not overwrite the saved values (this can be done manually if desired).
   */
  return new Settings(storage, {
    option1: true,
    option2: 'Ionitron J. Framework What What',
    option3: '3',
    option4: 'Hello'
  });
}

@NgModule({
  declarations: [
    MyApp,
    CardsPage,
    ChatPage,
    ItemCreatePage,
    ItemDetailPage,
    ListMasterPage,
    LoginPage,
    MapPage,
    MenuPage,
    SearchPage,
    SettingsPage,
    SignupPage,
    TabsPage,
    TutorialPage,
    WelcomePage,
    PostPage
  ],
  imports: [
    //ionicMaterial,
    BrowserModule,
    HttpModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [Http]
      }
    }),
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    ElasticModule,
    AutosizeModule,
  //  LueggModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    CardsPage,
    ChatPage,
    ItemCreatePage,
    ItemDetailPage,
    ListMasterPage,
    LoginPage,
    MapPage,
    MenuPage,
    SearchPage,
    SettingsPage,
    SignupPage,
    TabsPage,
    TutorialPage,
    WelcomePage,
    PostPage
  ],
  providers: [
    FirebaseService,
    Api,
    Items,
    User,
    Camera,
    GoogleMaps,
    SplashScreen,
    StatusBar,
    { provide: Settings, useFactory: provideSettings, deps: [Storage] },
    // Keep this to enable Ionic's runtime error handling during development
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
})
export class AppModule { }
