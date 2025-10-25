import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewidentityComponent } from './viewidentity.component';

describe('ViewidentityComponent', () => {
  let component: ViewidentityComponent;
  let fixture: ComponentFixture<ViewidentityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewidentityComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewidentityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
