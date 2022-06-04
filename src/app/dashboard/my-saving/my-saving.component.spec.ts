import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MySavingComponent } from './my-saving.component';

describe('MySavingComponent', () => {
  let component: MySavingComponent;
  let fixture: ComponentFixture<MySavingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MySavingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MySavingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
