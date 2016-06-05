import 'core-js';
import 'rxjs/Rx';
import 'zone.js/dist/zone';

import {bootstrap} from '@angular/platform-browser-dynamic';
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
      font-size: 30px;
    }
  `],
  directives: []
})
class Card {
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

}

@Component({
  selector: 'game-title',
  template: `
    <h1>真剣衰弱</h1>
  `
})
class GameTitleComponent {
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
class GameInfoComponent {
  @Input() score:number;
}

@Component({
  selector: 'game-body',
  template: `
    <card
      color="{{card.color}}"
      n="{{card.n}}"
      (openCard)="open($event)"
      *ngFor="let card of cards"
    >
    </card>
  `,
  directives: [Card]
})
class GameBodyComponent {
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


@Component({
  selector: 'game',
  template: `
    <game-title></game-title>
    <game-info score="{{score}}"></game-info>
    <game-body (scoreUp)="scoreUp($event)"></game-body>
  `,
  directives: [
    GameTitleComponent,
    GameInfoComponent,
    GameBodyComponent
  ]
})
class GameComponent {
  public score:number = 0;

  public scoreUp(n:number) {
    this.score ++;
  }
}

bootstrap(GameComponent);
