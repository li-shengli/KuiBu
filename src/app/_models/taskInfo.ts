export class TaskInfo {
    taskId: string;
    username: string;
    taskName: string;
    taskType: number;
    taskStatus: number;
    taskFrom: number;
    priority: number;
    startDate: Date;
    endDate: Date;
    lastUpdateDate: Date;

    pagesIntotal: number;
    pagesCurrent: number;
    expectedDays: number;
    //history: Map<number, number>;

    toString(){
        return this.taskId + this.taskName + this.taskType;
    }
}