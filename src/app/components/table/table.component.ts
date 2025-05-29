import { Component, Input, Output, EventEmitter, OnInit, SimpleChanges, ChangeDetectorRef, ChangeDetectionStrategy, OnChanges } from '@angular/core';
import { Task } from '../../interfaces/task_interface';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Dialog } from '@angular/cdk/dialog';
import { DialogModule } from '@angular/cdk/dialog';
import { UpdateTaskModalComponent } from '../modal/update-task-modal/update-task-modal.component';
import { TaskService } from '../../services/task-service.service';
import { ToastrService } from 'ngx-toastr';
import { SocketService } from '../../services/socket-service.service';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    DialogModule,
    UpdateTaskModalComponent
  ],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css',
  changeDetection: ChangeDetectionStrategy.Default
})
export class TableComponent implements OnInit, OnChanges  {
// En TableComponent
private _tasks: Task[] = [];

@Input() 
set tasks(value: Task[]) {
  this._tasks = value;
  console.log('TableComponent recibe nuevo tasks TTTT:', value);
  this.cdr.markForCheck();
}


get tasks(): Task[] {
  return this._tasks;
}

  @Output() refreshTasks = new EventEmitter<void>();
  @Output() deleteTask = new EventEmitter<number>();

  editMode: boolean = false;
  taskToEdit: Task | null = null;

  constructor(
    private taskService: TaskService,
    private toastr: ToastrService,
    private dialog: Dialog,
    private cdr: ChangeDetectorRef,
    private socketService: SocketService,
  ) {}

  trackByTaskId(index: number, task: Task): number {
  return task.id;
}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['tasks']) {
      console.log('Tasks changed en TableComponent:', this.tasks);
      this.cdr.markForCheck();
    }
  }

  ngOnInit(): void {
  this.socketService.listenToCustomEvent('task-deleted').subscribe((data) => {
    this.toastr.info(`Tarea eliminada remotamente (Id: ${data.id})`);
    this.refreshTasks.emit(); // 👈 refresca desde el padre si es necesario
    this.cdr.markForCheck(); // 👈 actualiza visualmente esta pestaña
  });

  this.socketService.listenToCustomEvent('task-updated').subscribe((data) => {
    this.toastr.info(`Tarea actualizada remotamente (Id: ${data.id})`);
    this.refreshTasks.emit();
    this.cdr.markForCheck();
  });
  }

  onDelete(taskId: number) {
    this.deleteTask.emit(taskId);
    this.toastr.success(`Tarea (Id: ${taskId}) eliminada`, '', { timeOut: 2000 });

    // this.socketService.emitCustomEvent('taskDeleted', { id: taskId }); // Emitir evento vía WebSocket si es necesario
  }

  onStartTask(taskId: number) {
    this.taskService.updateTaskStatus(taskId, 'en progreso').subscribe({
      next: () => {
        this.refreshTasks.emit();
      },
      error: (err) => {
        console.error('Error al iniciar tarea:', err);
      },
    });
  }

  onFinishTask(taskId: number) {
    this.taskService.updateTaskStatus(taskId, 'completada').subscribe({
      next: () => {
        this.refreshTasks.emit();
      },
      error: (err) => {
        console.error('Error al finalizar tarea:', err);
      },
    });
  }

  protected openModal(taskId: number) {
    const dialogRef = this.dialog.open(UpdateTaskModalComponent, {
      data: { id: taskId },
    });

    dialogRef.closed.subscribe((value) => {
      const shouldRefresh = value as boolean;
      if (shouldRefresh) {
        this.refreshTasks.emit();
      }
    });
  }
}