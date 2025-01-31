import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { DashboardService } from '../services/dashboard.service';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let dashboardService: jasmine.SpyObj<DashboardService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('DashboardService', ['getStats']);
    spy.getStats.and.returnValue({
      totalSales: 0,
      totalCost: 0,
      netProfit: 0,
      totalOrders: 0,
      orderCounts: {},
      completionRates: {}
    });

    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [
        { provide: DashboardService, useValue: spy }
      ]
    }).compileComponents();

    dashboardService = TestBed.inject(DashboardService) as jasmine.SpyObj<DashboardService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load stats on init', () => {
    expect(dashboardService.getStats).toHaveBeenCalled();
  });
});