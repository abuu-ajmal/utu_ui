import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewproservicesComponent } from './viewproservices.component';

describe('ViewproservicesComponent', () => {
  let component: ViewproservicesComponent;
  let fixture: ComponentFixture<ViewproservicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewproservicesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewproservicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
