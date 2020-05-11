import { Component, OnInit, OnDestroy, Input, Output, ChangeDetectionStrategy, EventEmitter, Renderer2, ElementRef, ViewChild } from '@angular/core';
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

  @ViewChild('video', { static: true }) videoElement: ElementRef;
  @ViewChild('canvas', { static: true }) canvas: ElementRef;
  videoWidth = 0;
  videoHeight = 0;
  constraints = {
    video: {
        facingMode: "environment",
        width: { ideal: 200 },
        height: { ideal: 200 }
    }
  };

  status = Status; // enum binding to use in view template

  modalVisible = false;

  stop$ = new Subject();

  currentNoteVal: string;
  orderNoteFC: FormControl = new FormControl('');
  orderNoteFC$: Observable<string>;

  

  constructor(private dialog: MatDialog, private router: Router, private renderer: Renderer2) { }

  ngOnInit() {
    // form input
    this.orderNoteFC$ = this.orderNoteFC.valueChanges;
    this.orderNoteFC$.pipe(
      debounceTime(400)
      , distinctUntilChanged()
      , filter(val => val && val !== '')
      , takeUntil(this.stop$)
    ).subscribe(val => this.currentNoteVal = val);

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


    this.startCamera();
  }

  ngOnDestroy() {
    this.stop$.next();
    this.stop$.complete();
  }

  onCancelMatch(agreement: Agreement) {
    this.updateItem.emit({ orderUpdate: agreement, updates: {
      shareId: agreement.shareId
      , status: Status.OrderCancelled
      , reason: 'User cancelled the match in agreement detail view'
    }});
  }

  onSubmitEdit() {
    this.createNote.emit({ noteBody: this.currentNoteVal, itemId: this.vm.itemDetails.itemId });
    this.orderNoteFC.patchValue('');
  }

  // TODO: this should be a routerLink in the view. Temp work around to move this story forward due to inability to toggle disabled state
  navigateBackToDashboard() {
    if (!this.modalVisible) {
      this.router.navigate(['/dashboard']);
    } else {
      return false;
    }
  }

  formatItemDetails(agreement: Agreement) {
    return `${agreement.quantity}${agreement.unitOfIssue ? ', ' + agreement.unitOfIssue : ''}${agreement.details ? ', ' + agreement.details : ''}`
  }

  takepicture(){
    this.renderer.setProperty(this.canvas.nativeElement, 'width', this.videoWidth);
    this.renderer.setProperty(this.canvas.nativeElement, 'height', this.videoHeight);
    this.canvas.nativeElement.getContext('2d').drawImage(this.videoElement.nativeElement, 0, 0);
  }  

  startCamera() {
    if (!!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)) {
        navigator.mediaDevices.getUserMedia(this.constraints).then(this.attachVideo.bind(this)).catch(this.handleError);
    } else {
        alert('Sorry, camera not available.');
    }
  }

  attachVideo(stream) {
    this.renderer.setProperty(this.videoElement.nativeElement, 'srcObject', stream);
    this.renderer.listen(this.videoElement.nativeElement, 'play', (event) => {
        this.videoHeight = this.videoElement.nativeElement.videoHeight;
        this.videoWidth = this.videoElement.nativeElement.videoWidth;
    });
  }

  handleError(error) {
    console.log('Error: ', error);
  }
}
