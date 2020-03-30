import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PromptsIndividualComponent } from '../prompts/prompts-individual/prompts-individual.component';
//import { SummaryComponent } from '../../prompts/prompts-individual/prompts-individual-summary/prompts-individual-summary.component';

import { PromptsOrganizationComponent } from 'src/app/prompts/prompts-organization/prompts-organization.component';

const routes: Routes = [
  {
    // TODO -- temp fix for routing to prompt for org data
    // Real solution...maybe consider a resolver on the prompt route and the resolver than determines org or indiv
    // and routes to the proper component
    path: 'prompt',
    component: PromptsOrganizationComponent,
  },
  {
    path: 'promptind',
    component: PromptsIndividualComponent,
  },
  {
    path: 'promptorg',
    component: PromptsOrganizationComponent,
  },
  // {
  //   path: 'summary',
  //   component: SummaryComponent,
  // },
  // {
  //   path: 'dashboard',
  //   component: DashboardComponent
  // },
//   {
//     path: 'metrics',
//     component: MetricsComponent,
//   },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PromptsRoutingModule {}
