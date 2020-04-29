import { Component, OnInit, ChangeDetectionStrategy, Input, OnDestroy, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject, BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil, filter, tap, finalize } from 'rxjs/operators';

import { IItemDetailState } from 'src/app/core/services/cce/item-details.service';
import { ICreateOrderNoteInput } from 'src/app/graphql/models/create-order-note-input';
import { Agreement } from '../models/agreement';
import { OrderChangeInput } from 'src/app/models/cce/order-model';
import { Status } from 'src/app/core/constants/enums';

@Component({
  selector: 'app-item-request',
  templateUrl: './item-request.component.html',
  styleUrls: ['../item-share/item-share.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemRequestComponent implements OnInit, OnDestroy {
  @Input() vm: IItemDetailState;
  @Output() createNote = new EventEmitter<Pick<ICreateOrderNoteInput, 'noteBody' | 'itemId'>>();
  @Output() updateItem = new EventEmitter<{ orderUpdate: Agreement, updates: Partial<OrderChangeInput> }>();

  status = Status; // enum binding to use in view template

  stop$ = new Subject();
  submit$ = new BehaviorSubject<boolean>(false);

  addNote = false;
  orderNoteFC: FormControl = new FormControl('');
  orderNoteFC$: Observable<string>;

  constructor() { }

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
        filter(([submit, _note]) => {
          return submit;
        })
        , tap(([_submit, orderNote]) => {
          this.createNote.emit({ noteBody: orderNote, itemId: this.vm.itemDetails.itemId });
          this.addNote = false;
        })
        , takeUntil(this.stop$)
      ).subscribe();
  }

  ngOnDestroy() {
    this.stop$.next();
    this.stop$.complete();
  }

  onCancelMatch(agreement: Agreement) {
    this.updateItem.emit({
      orderUpdate: agreement, updates: {
        status: Status.OrderCancelled
        , reason: 'User cancelled the match in agreement detail view'
      }
    });
  }

  onSubmitEdit() {
    this.submit$.next(true);
  }

  onCancelEdit() {
    this.addNote = false;
  }
}
