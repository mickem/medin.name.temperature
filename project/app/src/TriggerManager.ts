import Homey from 'homey';
import { Catch } from './utils';

interface ICardList {
  [key: string]: Homey.FlowCardTrigger;
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
        console.log(`Registring function: ${id}`);
        this.cards[id] = new Homey.FlowCardTrigger(id);
        (this.wrapper as any)[id] = async (args) => {
          if (!this.enabled) {
            return;
          }
          await this.cards[id].trigger(args);
        }
      } catch (error) {
        console.error(`Failed to register action card ${id}: `, error);
      }
    }

  }

  public get(): Triggers {
    return this.wrapper;
  }

  @Catch()
  public register() {
    console.log('Registering triggers');
    for (const id in this.cards) {
      this.cards[id].register();
    }
  }

  public enable() {
    console.log('Enabling all triggers');
    this.enabled = true;
  }
  public disable() {
    console.log('Disabling all triggers');
    this.enabled = false;
  }
}
