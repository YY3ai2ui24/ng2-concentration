import 'core-js';
import 'rxjs/Rx';
import 'zone.js/dist/zone';
import {Component, Input, Output, EventEmitter} from '@angular/core';
import {Card} from "./card.ts";

@Component({
  selector: 'game-title',
  template: `
    <h1>神経衰弱</h1>
  `
})
export class GameTitleComponent {
}

@Component({
  selector: 'game-info',
  template: `
    <p>{{score}}</p>
  `,
  styles: [`
    p {
      text-align: right;
    }
  `],
})
export class GameInfoComponent {
  @Input() score:number;
}

@Component({
  selector: 'game-body',
  template: `
    <card color="{{card.color}}" n="{{card.n}}" (openCard)="open($event)" *ngFor="let card of cards"></card>
  `,
  directives: [Card]
})
export class GameBodyComponent {
  @Output() scoreUp = new EventEmitter<number>();
  public cards: Object[] = [];
  public targets:Card[] = [];
  constructor() { // NOTE テクニック
    for (let color of ["yellow", "green", "red", "red"]) {
      for (let i = 1; i < 14; i++) {
        this.cards.push({
          n:i,
          color: color
        });
      }
    }
    let n:number = this.cards.length,
        t:Object,
        i:number;

    while (n) {
      i = Math.floor(Math.random() * n--);
      t = this.cards[n];
      this.cards[n] = this.cards[i];
      this.cards[i] = t;
    }
  }

  public open(card:Card) {
    if (this.targets.length === 0) {
      this.targets.push(card);
    } else {
      let target = this.targets.pop();
      if (target.n === card.n) {
        this.scoreUp.emit(1);
      } else {
        setTimeout(function() {
          target.close();
          card.close();
        }, 1000);
      }
    }
  }
}
