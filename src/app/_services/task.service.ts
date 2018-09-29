import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

@Injectable()
export class TaskService {
    constructor(private http: HttpClient) { }

    createTask() {
        console.debug("create new task!");
        return new Observable(); 
    }
}