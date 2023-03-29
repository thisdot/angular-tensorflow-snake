import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app/app.component';
import { LayoutComponent } from './app/layout/layout.component';
import { SignalsGameService } from './app/game/signals-game.service';
import { RxjsGameService } from './app/game/rxjs-game.service';
import { GameServiceBase } from './app/game/game.service.base';
import { RxjsGameBoardComponent } from './app/game/game-board/rxjs-game-board.component';
import { SignalsGameBoardComponent } from './app/game/game-board/signals-game-board.component';
bootstrapApplication(AppComponent, {
  providers: [
    provideRouter([
      {
        path: '',
        redirectTo: 'signals',
        pathMatch: 'full',
      },
      {
        path: 'signals',
        component: LayoutComponent,
        providers: [
          SignalsGameService,
          {
            provide: GameServiceBase,
            useExisting: SignalsGameService,
          },
        ],
        children: [
          {
            path: '',
            component: SignalsGameBoardComponent,
          },
        ],
      },
      {
        path: 'rxjs',
        component: LayoutComponent,
        providers: [
          RxjsGameService,
          {
            provide: GameServiceBase,
            useExisting: RxjsGameService,
          },
        ],
        children: [
          {
            path: '',
            component: RxjsGameBoardComponent,
          },
        ],
      },
    ]),
  ],
});
