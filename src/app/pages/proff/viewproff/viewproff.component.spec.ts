import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewproffComponent } from './viewproff.component';

describe('ViewproffComponent', () => {
  let component: ViewproffComponent;
  let fixture: ComponentFixture<ViewproffComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewproffComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewproffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
