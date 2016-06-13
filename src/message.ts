
export class Message {

  private event: string;

  private payload: any;

  public constructor(event: string, payload?: any) {
    this.event = event;
    this.payload = payload;
  }

}
