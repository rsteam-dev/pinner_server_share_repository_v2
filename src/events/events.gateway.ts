import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
  MessageBody,
} from '@nestjs/websockets';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Server } from 'ws';

// @WebSocketGateway(8080, { cors: '*' })
@WebSocketGateway(8080, { cors: '*', transports: ['websocket'] })
export class EventsGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('events')
  handleEvent(@MessageBody() message: string): string {
    console.log('message => ', message);
    this.server.emit('events', message);
    return message;
  }

  @SubscribeMessage('regions')
  handleEventRegions(@MessageBody() message: string): void {
    console.log('message => ', message);
    this.server.emit('regions', message);
  }

  // @SubscribeMessage('events')
  // handleMessage(@MessageBody() message: string): void {
  //   console.log(message);
  //   this.server.emit('message', message);
  // }
  // @SubscribeMessage('events')
  // onEvent(client: any, data: any): Observable<WsResponse<number>> {
  //   console.log('websoket hi');
  //   return from([1, 2, 3]).pipe(
  //     map((item) => ({ event: 'events', data: item })),
  //   );
  // }
}
