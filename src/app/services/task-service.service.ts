import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Task } from '../interfaces/task_interface';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface TasksResponse {
  data: Task[];
  // otras propiedades que pueda traer la respuesta si hay
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private readonly apiUrl = 'http://localhost:8080/api/v1/tasks';

  constructor(private http: HttpClient) { }

  getAllTasks(): Observable<Task[]> {
    return this.http.get<TasksResponse>(this.apiUrl)
      .pipe(
        map(response => response.data)  // Extraemos solo el array "data"
      );
  }

  getTaskById(id: number): Observable<Task> {
    return this.http.get<{ data: Task }>(`${this.apiUrl}/${id}`)
      .pipe(
        map(response => response.data)
      );
  }

  createTask(newTask: Partial<Task>): Observable<Task> {
    return this.http.post<{ data: Task }>(this.apiUrl, newTask)
      .pipe(
        map(response => response.data)
      );
  }

  updateTask(id: number, updatedTask: Partial<Task>): Observable<Task> {
    return this.http.put<{ data: Task }>(`${this.apiUrl}/${id}`, updatedTask)
      .pipe(
        map(response => response.data)
      );
  }

    updateTaskStatus(id: number, status: string): Observable<Task> {
    return this.http.patch<{ data: Task }>(`${this.apiUrl}/${id}/status`, { status })
      .pipe(map(response => response.data));
  }

  deleteTask(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
