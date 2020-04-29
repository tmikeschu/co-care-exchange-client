import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ItemDetailsService, IItemDetailState } from 'src/app/core/services/cce/item-details.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard-item-container',
  templateUrl: './dashboard-item-container.component.html',
  styleUrls: ['./dashboard-item-container.component.scss']
})
export class DashboardItemContainerComponent implements OnInit, OnDestroy {

  stop$ = new Subject();
  vm$: Observable<IItemDetailState> = this.itemDetailsService.store$;

  constructor(public route: ActivatedRoute, private router: Router, private itemDetailsService: ItemDetailsService) { }

  ngOnInit() {
    this.route.params.pipe(
      takeUntil(this.stop$),
      tap(params => {
        const itemId = params && params.id ? params.id : null;
        if (itemId) {
          this.itemDetailsService.getItem(itemId);
        } else {
          this.router.navigate(['/dashboard']);
        }
      })
    ).subscribe();
  }

  ngOnDestroy() {
    this.stop$.next();
    this.stop$.complete();
  }
}
