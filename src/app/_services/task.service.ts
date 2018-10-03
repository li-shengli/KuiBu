import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { TaskInfo } from '../_models';

@Injectable()
export class TaskService {
    url_prefix = 'http://localhost:8080/kuibu-restful';
    constructor(private http: HttpClient) { }

    createTask(taskInfo: TaskInfo) {
        console.debug("create new task!");
        this.http.post(this.url_prefix + '/task/add', taskInfo);
    }
}