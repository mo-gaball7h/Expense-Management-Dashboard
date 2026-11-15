import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';
import { ChartModule } from 'primeng/chart';
import { ExpenseService } from '../../../../core/services/expense.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-reports-page',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, ChartModule],
  templateUrl: './reports-page.html',
  styleUrl: './reports-page.scss'
})
export class ReportsPage implements OnInit {
  monthlyData: ChartData<'bar'> | null = null;
  categoryData: ChartData<'doughnut'> | null = null;
  total = 138500; // القيمة الافتراضية المباشرة لتظهر فوراً
  
  readonly options: ChartOptions = { 
    maintainAspectRatio: false, 
    plugins: { 
      legend: { position: 'bottom', labels: { usePointStyle: true, padding: 18 } } 
    } 
  };

  constructor(
    private service: ExpenseService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // جلب البيانات بالـ forkJoin لضمان التزامن الفوري
    forkJoin({
      monthly: this.service.getMonthlyChartData(),
      category: this.service.getCategoryChartData()
    }).subscribe({
      next: (res) => {
        this.monthlyData = { 
          labels: res.monthly.labels, 
          datasets: [{ 
            label: 'Expenses', 
            data: res.monthly.values, 
            backgroundColor: '#6478f5', 
            borderRadius: 7 
          }] 
        };

        this.categoryData = { 
          labels: res.category.labels, 
          datasets: [{ 
            label: 'Expenses', 
            data: res.category.values, 
            backgroundColor: ['#6478f5', '#31b7a2', '#f5b544', '#ed7890', '#8d75dc', '#5aafdc', '#a7b1c2'] 
          }] 
        };

        // حساب المجموع وتحديث الشاشة لحظياً
        this.total = res.category.values.reduce((a, b) => a + b, 0);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading reports', err);
      }
    });
  }
}