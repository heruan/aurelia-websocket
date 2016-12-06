
export class Message {

  public event: string;

  public payload: any;

  public constructor(event: string, payload?: any) {
    this.event = event;
    this.payload = payload;
  }

}
