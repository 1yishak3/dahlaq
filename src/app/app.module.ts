import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule, Http } from '@angular/http';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import * as firebase from 'firebase'
import {Deploy} from '@ionic/cloud-angular'

//var dFire = firebase.initializeApp(environment.firebase)
//import {ngSanitize} from 'angular-sanitize'
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
import { Network } from '@ionic-native/network'
import { Elastic } from 'angular2-elastic'
import { AutosizeModule } from 'ionic2-autosize'
import { environment } from '../environments/environment'
//import { EmojiPickerModule } from '@ionic-tools/emoji-picker';
import { MyApp } from './app.component';
import { StreamingMedia } from '@ionic-native/streaming-media'
import { EmojiPickerComponent } from '../assets/emoji-picker/emoji-picker'
import {EmojiProvider} from '../providers/emoji'
//import { ImageResizer } from '@ionic-native/image-resizer'
import { Ng2ImgToolsModule } from 'ng2-img-tools'
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
//import { PopoverPage } from '../pages/popovers/propop'
import { Api } from '../providers/api';
import { Items } from '../mocks/providers/items';
import { Settings } from '../providers/settings';
import { User } from '../providers/user';
import { FirebaseService } from '../providers/firebase'

import { Camera } from '../providers/camera';
import {Camera as Cam} from '@ionic-native/camera'

import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { MediaCapture } from '@ionic-native/media-capture'
import { File } from '@ionic-native/file'
import { MomentjsPipe } from '../pipes/moment'
import { TruncatePipe } from '../pipes/truncate'
//import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
//import { LueggModule } from 'angularjs-scroll-glue'
import { CloudSettings, CloudModule } from '@ionic/cloud-angular';
import { LinkyModule } from 'angular-linky'
import { IonicImageLoader } from 'ionic-image-loader'

const cloudSettings: CloudSettings = {
  'core': {
    'app_id': '78e6a99e'
  },
  'push': {
    'sender_id': '500593695235',
    'pluginConfig': {
      'ios': {
        'badge': true,
        'sound': true
      },
      'android': {
        'iconColor': '#343434'
      }
    }
  }
};

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
    PostPage,
    MomentjsPipe,
    TruncatePipe,
    EmojiPickerComponent
  //  PopoverPage
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
    Elastic,
    AutosizeModule,
//    EmojiPickerModule.forRoot(),
    NoopAnimationsModule,
    Ng2ImgToolsModule,
//    ngSanitize,
    LinkyModule,
    CloudModule.forRoot(cloudSettings),
    IonicImageLoader.forRoot(),

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
    PostPage,
  //  PopoverPage
  ],
  providers: [
    //ItemCreatePage,
    //PopoverPage,
    Cam,
    EmojiProvider,
    File,
    Network,
    //ImageResizer,
    MediaCapture,
    StreamingMedia,
    Camera,
    FirebaseService,
    Api,
    Items,
    User,
    SplashScreen,
    StatusBar,
    { provide: Settings, useFactory: provideSettings, deps: [Storage] },
    // Keep this to enable Ionic's runtime error handling during development
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
})
export class AppModule { }
