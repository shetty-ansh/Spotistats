import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Testing } from './testing';

describe('Testing', () => {
  let component: Testing;
  let fixture: ComponentFixture<Testing>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Testing]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Testing);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
