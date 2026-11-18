import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ExpenseService } from '../../../../core/services/expense.service';
import { EXPENSE_CATEGORIES } from '../../../../core/models/expense.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-categories-page',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, CardModule],
  templateUrl: './categories-page.html',
  styleUrl: './categories-page.scss'
})
export class CategoriesPage implements OnInit, OnDestroy {
  categories = EXPENSE_CATEGORIES;
  categoryStats: Record<string, { count: number; total: number }> = {};
  private subscription?: Subscription;

  constructor(private service: ExpenseService) {}

  ngOnInit(): void {
    this.subscription = this.service.expenses$.subscribe(expenses => {
      const stats: Record<string, { count: number; total: number }> = {};
      this.categories.forEach(category => stats[category] = { count: 0, total: 0 });
      expenses.forEach(expense => {
        const stat = stats[expense.category];
        stat.count += 1;
        stat.total += expense.amount;
      });
      this.categoryStats = stats;
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
