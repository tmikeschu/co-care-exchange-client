import { Component, OnInit, OnDestroy, Input, Output, ChangeDetectionStrategy, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, Subject, BehaviorSubject, combineLatest } from 'rxjs';
import { debounceTime, filter, distinctUntilChanged, takeUntil, take, tap, finalize } from 'rxjs/operators';

import { IItemDetailState } from 'src/app/core/services/cce/item-details.service';
import { Status } from 'src/app/core/constants/enums';
import { MatDialog } from '@angular/material';
import { ConfirmMatchDialogComponent } from '../confirm-new-match/confirm-new-match.component';
import { OrderChangeInput } from 'src/app/models/cce/order-model';
import { Agreement } from '../models/agreement';
import { ICreateOrderNoteInput } from 'src/app/graphql/models/create-order-note-input';
import { Router } from '@angular/router';

@Component({
  selector: 'app-item-share',
  templateUrl: './item-share.component.html',
  styleUrls: ['./item-share.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemShareComponent implements OnInit, OnDestroy {
  @Input() vm: IItemDetailState;
  @Output() createNote = new EventEmitter<Pick<ICreateOrderNoteInput, 'noteBody' | 'itemId'>>();
  @Output() updateItem = new EventEmitter<{ orderUpdate: Agreement, updates: Partial<OrderChangeInput> }>();

  status = Status; // enum binding to use in view template

  modalVisible = false;

  stop$ = new Subject();
  submit$ = new BehaviorSubject<boolean>(false);

  addNote = false;
  orderNoteFC: FormControl = new FormControl('');
  orderNoteFC$: Observable<string>;

  constructor(private dialog: MatDialog, private router: Router) { }

  ngOnInit() {
    // form input
    this.orderNoteFC$ = this.orderNoteFC.valueChanges;
    this.orderNoteFC$.pipe(
      debounceTime(400)
      , distinctUntilChanged()
      , takeUntil(this.stop$)
    );

    // form handler
    combineLatest([this.submit$, this.orderNoteFC$])
      .pipe(
        filter(([submit, _note]) => submit)
        , tap(([_submit, orderNote]) => {
          this.createNote.emit({ noteBody: orderNote, itemId: this.vm.itemDetails.itemId });
          this.addNote = false;
        })
        , takeUntil(this.stop$)
      ).subscribe();

    // confirm match
    if (this.vm.itemDetails && this.vm.itemDetails.status === Status.NewMatchFound) {
      this.modalVisible = true;
      const ref = this.dialog.open(ConfirmMatchDialogComponent, {
        width: '300px'
        , data: this.vm.itemDetails
      });

      ref.afterClosed().pipe(take(1)).subscribe(results => {
        this.modalVisible = false;
        if (results === 'Cancel') {
          // update order to cancel status Status.OrderCancelled
          this.updateItem.emit({ orderUpdate: this.vm.itemDetails, updates: {
            status: Status.OrderCancelled
            , reason: 'Sharer refused the drop off terms'
          }});
        } else if (results === 'Confirm') {
          // update order to delivery pending Status.DeliveryPending
          this.updateItem.emit({ orderUpdate: this.vm.itemDetails, updates: {
            status: Status.DeliveryPending
            , reason: 'Sharer confirmed ability to drop off the items.'
          }});
        }
      });
    }
  }

  ngOnDestroy() {
    this.stop$.next();
    this.stop$.complete();
  }

  onCancelMatch(agreement: Agreement) {
    this.updateItem.emit({ orderUpdate: agreement, updates: {
      status: Status.OrderCancelled
      , reason: 'User cancelled the match in agreement detail view'
    }});
  }

  onSubmitEdit() {
    this.submit$.next(true);
  }

  onCancelEdit() {
    this.addNote = false;
  }

  // TODO: this should be a routerLink in the view. Temp work around to move this story forward due to inability to toggle disabled state
  navigateBackToDashboard() {
    if (!this.modalVisible) {
      this.router.navigate(['/dashboard']);
    } else {
      return false;
    }
  }
}
