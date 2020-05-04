import { Component, OnInit, ChangeDetectionStrategy, Input, OnDestroy, Output, EventEmitter } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
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

  currentNoteVal: string;
  orderNoteFC: FormControl = new FormControl('');
  orderNoteFC$: Observable<string>;

  constructor() { }

  ngOnInit() {
    // form input
    this.orderNoteFC$ = this.orderNoteFC.valueChanges;
    this.orderNoteFC$.pipe(
      debounceTime(400)
      , distinctUntilChanged()
      , filter(val => val && val !== '')
      , takeUntil(this.stop$)
    ).subscribe(val => this.currentNoteVal = val);
  }

  ngOnDestroy() {
    this.stop$.next();
    this.stop$.complete();
  }

  onCancelMatch(agreement: Agreement) {
    this.updateItem.emit({
      orderUpdate: agreement, updates: {
        requestId: agreement.requestId
        , status: Status.OrderCancelled
        , reason: 'User cancelled the match in agreement detail view'
      }
    });
  }

  onSubmitEdit() {
    this.createNote.emit({ noteBody: this.currentNoteVal, itemId: this.vm.itemDetails.itemId });
    this.orderNoteFC.patchValue('');
  }
}
