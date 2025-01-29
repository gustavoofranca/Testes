import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InventoryComponent } from './inventory.component';
import { InventoryService } from '../services/inventory.service';
import { of } from 'rxjs';

describe('InventoryComponent', () => {
  let component: InventoryComponent;
  let fixture: ComponentFixture<InventoryComponent>;
  let inventoryService: jasmine.SpyObj<InventoryService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('InventoryService', ['getIngredients', 'updateIngredientQuantity']);
    spy.getIngredients.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [InventoryComponent],
      providers: [
        { provide: InventoryService, useValue: spy }
      ]
    }).compileComponents();

    inventoryService = TestBed.inject(InventoryService) as jasmine.SpyObj<InventoryService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load ingredients on init', () => {
    expect(inventoryService.getIngredients).toHaveBeenCalled();
  });

  it('should not update quantity if negative', () => {
    component.updateQuantity('1', -1);
    expect(inventoryService.updateIngredientQuantity).not.toHaveBeenCalled();
  });

  it('should update quantity if positive', () => {
    component.updateQuantity('1', 5);
    expect(inventoryService.updateIngredientQuantity).toHaveBeenCalledWith('1', 5);
  });
});