import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-clock',
  templateUrl: './clock.component.html',
  styleUrls: ['./clock.component.scss']
})
export class ClockComponent implements OnInit {
  currentTime: any;

  constructor() {
  }

  ngOnInit(): void {
    setInterval(() => {
      this.systemClock();
    }, 1000);
  }

  systemClock() {
    const currentTime = new Date();
    let currentHours = currentTime.getHours();
    let currentMinutes: any = currentTime.getMinutes();
    let currentSeconds: any = currentTime.getSeconds();

    currentMinutes = (currentMinutes < 10 ? '0' : '') + currentMinutes;
    currentSeconds = (currentSeconds < 10 ? '0' : '') + currentSeconds;

    const timeOfDay = currentHours < 12 ? 'AM' : 'PM';

    currentHours = currentHours > 12 ? currentHours - 12 : currentHours;
    currentHours = currentHours === 0 ? 12 : currentHours;

    const currentTimeString =
      currentHours +
      ':' +
      currentMinutes +
      ':' +
      currentSeconds +
      ' ' + ' ' +
      timeOfDay;

    this.currentTime = currentTimeString;
  }
}
