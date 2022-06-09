import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-star',
  templateUrl: './star.component.html',
  styleUrls: ['./star.component.scss']
})
export class StarComponent implements OnInit {
  starClassName = 'star-rating-blank';
  // eslint-disable-next-line @typescript-eslint/member-ordering
  @Input() starId;
  // eslint-disable-next-line @typescript-eslint/member-ordering
  @Input() rating;
  // eslint-disable-next-line @typescript-eslint/member-ordering
  @Output() leave: EventEmitter<number> = new EventEmitter();
  // eslint-disable-next-line @typescript-eslint/member-ordering
  @Output() enter: EventEmitter<number> = new EventEmitter();
  // eslint-disable-next-line @typescript-eslint/member-ordering
  @Output() bigClick: EventEmitter<number> = new EventEmitter();
  constructor() {}

  ngOnInit() {
    if (this.rating >= this.starId) {
      this.starClassName = 'star-rating-filled';
    }
  }

  onenter() {
    this.enter.emit(this.starId);
  }

  onleave() {
    this.leave.emit(this.starId);
  }

  starClicked() {
    this.bigClick.emit(this.starId);
  }
}
