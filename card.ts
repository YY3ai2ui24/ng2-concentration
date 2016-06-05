import 'core-js';
import 'rxjs/Rx';
import 'zone.js/dist/zone';
import {Component, Input, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'card',
  template: `
    <div *ngIf="isOpen" [style.background-color]="color">
      <span>{{getName()}}</span>
    </div>
    <div *ngIf="!isOpen" [style.background-color]="black" (click)="open()">
      <span>裏</span>
    </div>
  `,
  styles: [`
    div {
      width: 60px;
      height: 60px;
      display: inline-block;
      border: outset 5px;
      text-align: center;
      text-size: 30px;
      margin: 0 auto;
    }
  `],
  directives: []
})
export class Card {
  @Input() color: string;
  @Input() n: number;

  @Output() openCard = new EventEmitter<Card>();

  private isOpen:boolean = false;

  public getName(): string {
    let s = this.n.toString();
    switch (s) {
      case "1":s = "A";break;
      case "11":s = "J";break;
      case "12":s = "Q";break;
      case "13":s = "K";break;
    }
    return s;
  }

  public open(): void {
    this.openCard.emit(this);
    this.isOpen = true;
  }

  public close(): void {
    this.isOpen = false;
  }

  public toggle(): void {
    this.isOpen = this.isOpen ? false: true;
  }

}
