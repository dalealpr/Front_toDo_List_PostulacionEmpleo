import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { TaskService } from '../../services/task-service.service';
import { SocketService } from '../../services/socket-service.service';
import { Task } from '../../interfaces/task_interface';
import { TableComponent } from '../../components/table/table.component';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { NgZone } from '@angular/core';

@Component({
  selector: 'app-tasks-view',
  standalone: true,
  imports: [CommonModule, TableComponent],
  templateUrl: './tasks-view.component.html',
  styleUrl: './tasks-view.component.css'
})
export class TasksViewComponent implements OnInit {

  tasks: Task[] = [];
  private socketSub?: Subscription;

  constructor(
    private taskService: TaskService,
    private socketService: SocketService,
    private cdr: ChangeDetectorRef,
    private zone: NgZone
  ) { }

  ngOnInit(): void {
    this.getTasks();

    this.socketSub = this.socketService.listenToCustomEvent('tasksUpdated')
      .subscribe(() => {
        this.zone.run(() => {
          console.log('⚡ Evento tasksUpdated recibido, recargando tareas...');
          this.getTasks();
        });
      });;
  }

  ngOnDestroy(): void {
    // Cancelar la suscripción para evitar memory leaks
    this.socketSub?.unsubscribe();
  }

  getTasks(): void {
    this.taskService.getAllTasks().subscribe({
      next: (tasksFromApi) => {
        this.tasks = [...tasksFromApi];
        console.log('Lista de Tareas:', this.tasks);
        this.cdr.markForCheck();
      },
      error: (err) => console.error('Error al cargar tareas:', err)
    });
  }

  deleteTask(taskId: number) {
    this.taskService.deleteTask(taskId).subscribe({
      next: () => {
        console.log(`✅ Tarea con [ID:${taskId}] eliminada correctamente.`);
        // Elimina la tarea localmente para actualizar la tabla sin recargar
        this.tasks = this.tasks.filter(task => task.id !== taskId);
        this.socketService.emitCustomEvent('tasksUpdated', {});
      },
      error: (err) => console.error(err)
    });
  }
}