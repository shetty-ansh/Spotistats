import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Artists } from './artists';

describe('Artists', () => {
  let component: Artists;
  let fixture: ComponentFixture<Artists>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Artists]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Artists);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
