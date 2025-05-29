import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TaskService } from '../../services/task-service.service';
import { Task } from '../../interfaces/task_interface';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-task-view',
  standalone:true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './create-task-view.component.html',
  styleUrl: './create-task-view.component.css'
})
export class CreateTaskViewComponent {

  // Formulario
  createTaskForm: FormGroup
  titulo: FormControl
  descripcion: FormControl
  status: FormControl

  constructor(
    private taskService: TaskService,
    private router: Router,
    private toastr: ToastrService
  ) {

    this.titulo = new FormControl('')
    this.descripcion = new FormControl('')
    this.status = new FormControl('pendiente')

    this.createTaskForm = new FormGroup({
      titulo: this.titulo,
      descripcion: this.descripcion,
      status: this.status
    })
  }

  handleSubmit(): void {
    if (this.createTaskForm.valid) {
      const formData = this.createTaskForm.value;

      this.taskService.createTask(formData).subscribe({
        next: (createdTask: Task) => {
          this.toastr.success('Tarea creada exitosamente 🎉', '', {
            timeOut: 2500 // duración en milisegundos (ej: 2 segundos)
          });
          console.log('✅ Tarea creada exitosamente:', createdTask);
          this.createTaskForm.reset();
          this.router.navigate(['/tasks']);
        },
        error: (err) => {
          console.error('Error al crear la tarea:', err);
          this.toastr.error('Ocurrió un error al crear la tarea ❌');
        }
      });
    } else {
      console.warn('Formulario inválido');
    }
  }
}
