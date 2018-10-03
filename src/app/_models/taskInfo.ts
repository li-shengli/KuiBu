export class TaskInfo {
    taskId: string;
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
    daysExpected: number;
    //history: Map<number, number>;
}