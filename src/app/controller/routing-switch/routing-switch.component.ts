import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { of } from 'rxjs';
import { delay, take } from 'rxjs/operators';

@Component({
  selector: 'snake-routing-switch',
  templateUrl: './routing-switch.component.html',
  styleUrls: ['./routing-switch.component.scss'],
  standalone: true,
  imports: [FormsModule, RouterModule],
})
export class RoutingSwitchComponent {
  public signals = this.activatedRoute.snapshot.url[0].path === 'signals';

  public constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {}

  public switchMode(): void {
    this.signals = !this.signals;
    of(null)
      .pipe(delay(300), take(1))
      .subscribe(() => {
        const url = this.signals ? '/signals' : '/rxjs';
        this.router.navigate([url]);
      });
  }
}
