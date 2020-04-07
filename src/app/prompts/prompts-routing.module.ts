import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PromptsComponent } from 'src/app/prompts/prompts/prompts.component';

const routes: Routes = [
  {
    path: 'prompt',
    component: PromptsComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PromptsRoutingModule {}
