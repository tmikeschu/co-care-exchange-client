import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { IItemDetailState } from 'src/app/core/services/cce/item-details.service';

@Component({
  selector: 'app-item-share',
  templateUrl: './item-share.component.html',
  styleUrls: ['./item-share.component.scss', '../agreement-detail/agreement-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemShareComponent implements OnInit {
  @Input() viewModel: IItemDetailState;
  constructor() { }

  ngOnInit() {
  }

}
