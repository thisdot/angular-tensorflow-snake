// borrowed from Connie Leung's tutorial at https://dev.to/railsstudent/take-photos-with-web-camera-using-rxjs-and-angular-8fn
import { isPlatformBrowser } from '@angular/common';
import {
  ClassProvider,
  FactoryProvider,
  InjectionToken,
  PLATFORM_ID,
} from '@angular/core';

/* Create a new injection token for injecting the navigator into a component. */
export const NAVIGATOR = new InjectionToken('NavigatorToken');

export abstract class NavigatorRef {
  get nativeNavigator(): Navigator | Object {
    throw new Error('Not implemented.');
  }
}

/* Define class that implements the abstract class and returns the native navigator object. */
export class BrowserNavigatorRef extends NavigatorRef {
  constructor() {
    super();
  }

  override get nativeNavigator(): Object | Navigator {
    return navigator;
  }
}

/* Create a injectable provider for the NavigatorRef token that uses the BrowserNavigatorRef class. */
const browserNavigatorProvider: ClassProvider = {
  provide: NavigatorRef,
  useClass: BrowserNavigatorRef,
};

/* Create an injectable provider that uses the navigatorFactory function for returning the native navigator object. */
const navigatorProvider: FactoryProvider = {
  provide: NAVIGATOR,
  useFactory: (browserWindowRef: BrowserNavigatorRef, platformId: Object) =>
    isPlatformBrowser(platformId)
      ? browserWindowRef.nativeNavigator
      : new Object(),
  deps: [NavigatorRef, PLATFORM_ID],
};

/* Create an array of providers. */
export const NAVIGATOR_PROVIDERS = [
  browserNavigatorProvider,
  navigatorProvider,
];
