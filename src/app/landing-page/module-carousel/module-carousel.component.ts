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
      title: 'Member Management'
    }, {
      icon: 'perm_data_setting',
      text: `Lorem ipsum dolor sit amet conse ctetur adipi sicing elit. Doloribus numquam quis.`,
      title: 'Share Management'
    },
    {
      icon: 'dashboard',
      text: `Lorem ipsum dolor sit amet conse ctetur adipi sicing elit. Doloribus numquam quis.`,
      title: 'Savings & Deposits Management'
    }, {
      icon: 'dashboard',
      text: `Lorem ipsum dolor sit amet conse ctetur adipi sicing elit. Doloribus numquam quis.`,
      title: 'Loan Management'
    }, {
      icon: 'dashboard',
      text: `Lorem ipsum dolor sit amet conse ctetur adipi sicing elit. Doloribus numquam quis.`,
      title: 'Planning & Budgeting'
    }, {
      icon: 'dashboard',
      text: `Lorem ipsum dolor sit amet conse ctetur adipi sicing elit. Doloribus numquam quis.`,
      title: 'Expenditure Management'
    }, {
      icon: 'dashboard',
      text: `Lorem ipsum dolor sit amet conse ctetur adipi sicing elit. Doloribus numquam quis.`,
      title: 'Bulk SMS'
    }
  ];

  constructor() {
  }

  ngOnInit(): void {
  }
}
