import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Recents } from './recents';

describe('Recents', () => {
  let component: Recents;
  let fixture: ComponentFixture<Recents>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Recents]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Recents);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
