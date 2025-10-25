import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddidentityComponent } from './addidentity.component';

describe('AddidentityComponent', () => {
  let component: AddidentityComponent;
  let fixture: ComponentFixture<AddidentityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddidentityComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddidentityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
