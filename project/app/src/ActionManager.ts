import Homey from 'homey';
import { IActionHandler } from './Actions';
import { Catch } from './utils';

interface ICardList {
  [key: string]: Homey.FlowCardAction;
}
export class ActionManager {
  private handler: IActionHandler;
  private cards: ICardList;

  constructor(handler: IActionHandler) {
    this.handler = handler;
    this.cards = {};
    for (const id in handler) {
      try {
        console.log(`Adding action card: ${id}`);
        this.cards[id] = new Homey.FlowCardAction(id);
      } catch (error) {
        console.error(`Failed to register action card ${id}: `, error);
      }
    }
  }

  @Catch()
  public register() {
    console.log('Registering all actions');
    for (const id in this.cards) {
      (this.cards[id] as any).register().registerRunListener((args, state) => {
        console.log(this.handler[id](args));
        return Promise.resolve(this.handler[id](args));
      });
    }
  }
}
