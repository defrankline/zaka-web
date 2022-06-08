import {Component, Input, OnInit} from '@angular/core';
import {NguCarouselConfig} from '@ngu/carousel';

@Component({
  selector: 'app-module-carousel',
  templateUrl: './module-carousel.component.html',
  styleUrls: ['./module-carousel.component.scss']
})
export class ModuleCarouselComponent implements OnInit {
  @Input('backgroundGray') public backgroundGray;

  public modules = [
    {
      icon: 'dashboard',
      text: `Lorem ipsum dolor sit amet conse ctetur adipi sicing elit. Doloribus numquam quis.`,
      title: 'Ratiba'
    }, {
      icon: 'dashboard',
      text: `Lorem ipsum dolor sit amet conse ctetur adipi sicing elit. Doloribus numquam quis.`,
      title: 'Miradi'
    }, {
      icon: 'dashboard',
      text: `Lorem ipsum dolor sit amet conse ctetur adipi sicing elit. Doloribus numquam quis.`,
      title: 'Matukio'
    }, {
      icon: 'dashboard',
      text: `Lorem ipsum dolor sit amet conse ctetur adipi sicing elit. Doloribus numquam quis.`,
      title: 'Jumuiya'
    }, {
      icon: 'dashboard',
      text: `Lorem ipsum dolor sit amet conse ctetur adipi sicing elit. Doloribus numquam quis.`,
      title: 'Matangazo'
    }
  ];

  constructor() {
  }

  ngOnInit(): void {
  }
}
