import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MinigameSortingComponent } from './minigame-sorting.component';

describe('MinigameSortingComponent', () => {
  let component: MinigameSortingComponent;
  let fixture: ComponentFixture<MinigameSortingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MinigameSortingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MinigameSortingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
