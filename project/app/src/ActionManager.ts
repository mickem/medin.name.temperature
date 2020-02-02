import { FlowCardAction } from 'homey';
import { log } from './LogManager';
import { Catch } from './utils';

interface ICardList {
  [key: string]: FlowCardAction;
}
export class ActionManager<Handler> {
  private handler: Handler;
  private cards: ICardList;

  constructor(handler: Handler) {
    this.handler = handler;
    this.cards = {};
    for (const id in handler) {
      try {
        this.cards[id] = new FlowCardAction(id);
      } catch (error) {
        console.error(`Failed to register action card ${id}: `, error);
      }
    }
  }

  @Catch()
  public register() {
    log(`Registering ${Object.keys(this.cards).length} actions`);
    for (const id in this.cards) {
      (this.cards[id] as any).register().registerRunListener((args, state) => {
        return Promise.resolve(this.handler[id](args));
      });
    }
  }
}
