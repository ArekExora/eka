import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home';
import { AuthGuard } from './_services';



const accountModule = () => import('./account').then(x => x.AccountModule);
const roomModule = () => import('./room').then(x => x.RoomModule);

const routes: Routes = [
  { path: '',           component: HomeComponent,     canActivate: [AuthGuard] },
  { path: 'rooms',      loadChildren: roomModule,     canActivate: [AuthGuard] },
  { path: 'account',    loadChildren: accountModule },

  // otherwise redirect to home
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
