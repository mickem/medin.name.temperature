import { FlowCardTrigger } from 'homey';
import { error, log } from './LogManager';
import { Catch } from './utils';

interface ICardList {
  [key: string]: FlowCardTrigger;
}

export class TriggerManager<Triggers> {
  private enabled: boolean;
  private cards: ICardList;
  private wrapper: Triggers;

  constructor(functions: string[]) {
    this.enabled = true;
    this.wrapper = {} as Triggers;
    this.cards = {};

    for (const id of functions) {
      try {
        log(`Registring function: ${id}`);
        this.cards[id] = new FlowCardTrigger(id);
        (this.wrapper as any)[id] = async args => {
          if (!this.enabled) {
            return;
          }
          await this.cards[id].trigger(args);
        };
      } catch (err) {
        error(`Failed to register action card ${id}: ${err}`);
      }
    }
  }

  public get(): Triggers {
    return this.wrapper;
  }

  @Catch()
  public register() {
    log('Registering triggers');
    for (const id in this.cards) {
      this.cards[id].register();
    }
  }

  public enable() {
    log('Enabling all triggers');
    this.enabled = true;
  }
  public disable() {
    log('Disabling all triggers');
    this.enabled = false;
  }
}
