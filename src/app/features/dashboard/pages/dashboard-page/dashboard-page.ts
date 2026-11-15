import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';
import { combineLatest, Subscription } from 'rxjs';
import { ChartModule } from 'primeng/chart';
import { ExpenseService } from '../../../../core/services/expense.service';
import { DashboardStats } from '../../../../core/models/expense.model';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, ChartModule],
  templateUrl: './dashboard-page.html',
  styleUrl: './dashboard-page.scss'
})
export class DashboardPage implements OnInit, OnDestroy {
  // وضع قيم افتراضية مبدئية لكي تظهر الأرقام والكروت من أول ثانية بدون لودينغ
  stats: DashboardStats | null = {
    totalExpenses: 138500,
    currentMonthExpenses: 85050,
    previousMonthExpenses: 10250,
    transactionCount: 12,
    highestCategory: 'Salaries',
    highestCategoryAmount: 62000
  };
  
  loading = false;
  error = '';
  monthlyData: ChartData<'bar'> | null = null;
  categoryData: ChartData<'doughnut'> | null = null;

  readonly chartOptions: ChartOptions<'bar'> = {
    maintainAspectRatio: false,
    plugins: { legend: { labels: { color: '#6478b', usePointStyle: true, padding: 18 } } },
    scales: {
      x: { ticks: { color: '#6478b' }, grid: { display: false } },
      y: { beginAtZero: true, ticks: { color: '#6478b' }, grid: { color: '#eef2f7' } }
    }
  };

  readonly doughnutOptions: ChartOptions<'doughnut'> = {
    maintainAspectRatio: false,
    cutout: '65%',
    plugins: { legend: { position: 'bottom', labels: { usePointStyle: true, padding: 14 } } }
  };

  private subscription?: Subscription;

  constructor(
    private expenseService: ExpenseService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.subscription = combineLatest({
      stats: this.expenseService.getDashboardStats(),
      monthly: this.expenseService.getMonthlyChartData(),
      categories: this.expenseService.getCategoryChartData()
    }).subscribe({
      next: result => {
        this.error = '';
        this.stats = result.stats;
        this.monthlyData = { 
          labels: result.monthly.labels, 
          datasets: [{ label: 'Expenses', data: result.monthly.values, backgroundColor: '#6478f5', borderRadius: 7 }] 
        };
        this.categoryData = { 
          labels: result.categories.labels, 
          datasets: [{ data: result.categories.values, backgroundColor: ['#6478f5', '#31b7a2', '#f5b544', '#ed7890', '#8d75dc', '#5aafdc', '#a7b1c2'], hoverOffset: 5 }] 
        };
        this.loading = false;
        this.cdr.detectChanges(); // تحديث فوري للشاشة من أول ضغطة
      },
      error: () => {
        this.error = 'Could not load dashboard data.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  ngOnDestroy(): void { 
    this.subscription?.unsubscribe(); 
  }
}