import { SocketService } from './../../../services/socket-service.service';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, Inject, inject, NgZone } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TaskService } from '../../../services/task-service.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-update-task-modal',
  standalone:true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './update-task-modal.component.html',
  styleUrl: './update-task-modal.component.css'
})
export class UpdateTaskModalComponent {

  private dialogRef = inject(DialogRef, { optional: true })
  private data = inject<{ id: number }>(DIALOG_DATA);
  private taskService = inject(TaskService);


  // Formulario
  taskForm: FormGroup
  titulo: FormControl
  descripcion: FormControl
  status: FormControl

  constructor(private socketService: SocketService, private zone: NgZone) {

    this.titulo = new FormControl('')
    this.descripcion = new FormControl('')
    this.status = new FormControl('')

    this.taskForm = new FormGroup({
      titulo: this.titulo,
      descripcion: this.descripcion,
      status: this.status
    })
  }

  ngOnInit(): void {
    this.taskService.getTaskById(this.data.id).subscribe({
      next: (task) => {
        this.taskForm.patchValue({
          titulo: task.titulo,
          descripcion: task.descripcion,
          status: task.status
        });
      },
      error: (err) => {
        console.error('Error al obtener tarea:', err);
      }
    });
  }

  // Metodos
  protected closeModal() {
    this.dialogRef?.close(true)
  }

  handleSubmit(): void {
    const updatedData = this.taskForm.value;
    this.taskService.updateTask(this.data.id, updatedData).subscribe({
      next: (updatedTask) => {
        console.log('✅ Tarea actualizada:', updatedTask);

        // Emitimos el evento por socket
       this.socketService.emitCustomEvent('tasksUpdated', {});

        this.closeModal();
      },
      error: (err) => {
        console.error('Error al actualizar tarea:', err);
      }
    });
  }

}
