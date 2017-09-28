import { ListMasterPage } from './list-master/list-master';
import { SearchPage } from './search/search';
import { SettingsPage } from './settings/settings';
import { TabsPage } from './tabs/tabs';
import { TutorialPage } from './tutorial/tutorial';
import { CardsPage } from './cards/cards';
import { MapPage } from './map/map';
import {ItemDetailPage} from './item-detail/item-detail'
import { ItemCreatePage } from './item-create/item-create';

// The page the user lands on after opening the app and without a session
export const FirstRunPage = TutorialPage;
// The main page the user will see as they use the app over a long period of time.
// Change this if not using tabs
export const MainPage = TabsPage;

// The initial root pages for our tabs (remove if not using tabs)
export const Tab1Root = ListMasterPage;
export const Tab2Root = ItemCreatePage;
export const Tab10Root = ItemDetailPage;
export const Tab4Root = CardsPage;
export const Tab5Root = MapPage;
