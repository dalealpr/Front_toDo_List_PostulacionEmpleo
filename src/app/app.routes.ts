import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// Pages
import { HomePageComponent } from './pages/home-page/home-page.component';
// Views
import { TasksViewComponent } from './views/tasks-view/tasks-view.component';
import { ProyectViewComponent } from './views/proyect-view/proyect-view.component';
import { CreateTaskViewComponent } from './views/create-task-view/create-task-view.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { RegisterPageComponent } from './pages/register-page/register-page.component';

export const routes: Routes = [
{
    path:'',
    component: HomePageComponent,
    children: [
      { path: '', redirectTo: 'proyect', pathMatch: 'full' },
      { path: 'proyect', component: ProyectViewComponent },
      { path: 'tasks', component: TasksViewComponent },
      { path: 'create-task', component: CreateTaskViewComponent },
    ]
  },

    // Rutas de páginas independientes
  { path: 'login', component: LoginPageComponent },
  { path: 'register', component: RegisterPageComponent },


];

@NgModule({
  imports: [RouterModule.forRoot(routes)], // 👈 importante
  exports: [RouterModule] // 👈 esto también
})

export class AppRoutingModule {}
