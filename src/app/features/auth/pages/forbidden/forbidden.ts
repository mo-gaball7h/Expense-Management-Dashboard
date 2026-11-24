import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-forbidden',
  standalone: true,
  imports: [RouterLink],
  template: `
    <main class="access-denied">
      <span class="access-denied-icon"><i class="pi pi-lock"></i></span>
      <p class="eyebrow">ACCESS RESTRICTED</p>
      <h1>You don't have permission to view this page.</h1>
      <p>Ask your workspace administrator if you need access.</p>
      <a routerLink="/dashboard">Back to dashboard</a>
    </main>
  `,
  styles: [`
    .access-denied{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:32px;text-align:center;background:#f7f8fc;color:#172033}
    .access-denied-icon{width:64px;height:64px;display:grid;place-items:center;border-radius:20px;background:#eef2ff;color:#4f46e5;font-size:26px}
    .eyebrow{margin:22px 0 8px;color:#6366f1;font-size:11px;font-weight:800;letter-spacing:.12em}
    h1{max-width:520px;margin:0;font-size:28px;line-height:1.25}
    p:not(.eyebrow){color:#64748b}
    a{margin-top:12px;padding:11px 18px;border-radius:10px;background:#4f46e5;color:#fff;text-decoration:none;font-weight:700}
    :host-context(body.dark-mode) .access-denied{background:#0b1220;color:#f1f5f9}
    :host-context(body.dark-mode) .access-denied-icon{background:#252454;color:#a5b4fc}
    :host-context(body.dark-mode) p:not(.eyebrow){color:#94a3b8}
  `]
})
export class ForbiddenPage {}
