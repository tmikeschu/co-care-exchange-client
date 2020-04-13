import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PromptsComponent } from 'src/app/prompts/prompts/prompts.component';
import {UserResolver} from '../core/resolvers/user.resolver';

const routes: Routes = [
  {
    path: '',
    component: PromptsComponent,
    resolve: { user: UserResolver },
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PromptsRoutingModule {}
