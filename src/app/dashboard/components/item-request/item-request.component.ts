import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { IItemDetailState } from 'src/app/core/services/cce/item-details.service';

@Component({
  selector: 'app-item-request',
  templateUrl: './item-request.component.html',
  styleUrls: ['./item-request.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemRequestComponent implements OnInit {
  @Input() viewModel: IItemDetailState;
  constructor() { }

  ngOnInit() {
  }

}
