import {Component, OnInit} from '@angular/core';
import * as SockJS from 'sockjs-client';
import * as StompJs from '@stomp/stompjs';
import {ApiConfig} from '../../shared';
import {Notification} from './notification';
import {NotificationService} from './notification.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {
  public notifications: Notification[] = [];
  private client: StompJs.Client;

  constructor(private notificationService: NotificationService) {
  }

  ngOnInit(): void {
    this.connectClicked();
    this.loadNewNotifications();
  }

  loadNewNotifications(): void {
    this.notificationService.getAllNew().subscribe(response => {
      this.notifications = response.data;
    });
  }

  connectClicked(): void {
    if (!this.client || this.client.connected) {
      this.client = new StompJs.Client({
        webSocketFactory: () => new SockJS(ApiConfig.server + '/notifications'),
        debug: (msg: string) => console.log(msg)
      });

      this.client.onConnect = () => {

        this.startClicked();

        this.client.subscribe('/user/notification/item', (response) => {
          const notification: Notification = JSON.parse(response.body);
          this.notifications.push(notification);
        });
        console.log('connected!');
      };

      this.client.onStompError = (frame) => {
        console.error(frame.headers.message);
        console.error('Details:', frame.body);
      };

      this.client.activate();
    }
  }

  disconnectClicked(): void {
    if (this.client && this.client.connected) {
      this.client.deactivate();
      this.client = null;
      console.log('disconnected :-/');
    }
  }

  startClicked(): void {
    if (this.client && this.client.connected) {
      this.client.publish({destination: '/swns/start'});
    }
  }

  stopClicked(): void {
    if (this.client && this.client.connected) {
      this.client.publish({destination: '/swns/stop'});
    }
  }

  openMessage(notification: Notification): void {

  }

  read(): void {
    this.notificationService.read().subscribe(response => {
    });
  }
}

