import { CommonModule, CurrencyPipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';
import { ChartModule } from 'primeng/chart';
import { combineLatest, Subscription } from 'rxjs';
import { ExpenseService } from '../../../../core/services/expense.service';

@Component({
  selector: 'app-reports-page',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, ChartModule],
  templateUrl: './reports-page.html',
  styleUrl: './reports-page.scss'
})
export class ReportsPage implements OnInit, OnDestroy {
  monthlyData: ChartData<'bar'> | null = null;
  categoryData: ChartData<'doughnut'> | null = null;
  total = 0;
  loading = true;
  error = '';
  private subscription?: Subscription;

  readonly options: ChartOptions = {
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom', labels: { usePointStyle: true, padding: 18 } }
    }
  };

  constructor(private service: ExpenseService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.subscription = combineLatest({
      monthly: this.service.getMonthlyChartData(),
      category: this.service.getCategoryChartData(),
      stats: this.service.getDashboardStats()
    }).subscribe({
      next: res => {
        this.monthlyData = {
          labels: res.monthly.labels,
          datasets: [{ label: 'Expenses', data: res.monthly.values, backgroundColor: '#6478f5', borderRadius: 7 }]
        };
        this.categoryData = {
          labels: res.category.labels,
          datasets: [{ label: 'Expenses', data: res.category.values, backgroundColor: ['#6478f5', '#31b7a2', '#f5b544', '#ed7890', '#8d75dc', '#5aafdc', '#a7b1c2'] }]
        };
        this.total = res.stats.totalExpenses;
        this.error = '';
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.error = 'Could not load report data. Please try again.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
