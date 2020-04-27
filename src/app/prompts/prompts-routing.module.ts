import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PromptsComponent } from 'src/app/prompts/prompts/prompts.component';
import { AuthGuard } from '../core/guards/auth.guard';

const routes: Routes = [
  {
    path: 'prompt',
    component: PromptsComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PromptsRoutingModule {}
