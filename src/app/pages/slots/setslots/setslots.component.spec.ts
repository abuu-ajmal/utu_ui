import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetslotsComponent } from './setslots.component';

describe('SetslotsComponent', () => {
  let component: SetslotsComponent;
  let fixture: ComponentFixture<SetslotsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SetslotsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SetslotsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
