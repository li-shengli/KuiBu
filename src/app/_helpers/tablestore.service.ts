import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User, UserTable } from '../_models';

declare var TableStore: any;

@Injectable()
export class TablestoreService {
    client = null;
    constructor(private http: HttpClient) {
        this.client = new TableStore.Client({
            accessKeyId: 'LTAIuoXQVQP9aT2P',
            secretAccessKey: '8ZgXapHridx3g5N4ipM0sa5UU5FQxX',
            endpoint: 'https://kuibu.cn-beijing.ots.aliyuncs.com',
            instancename: 'kuibu',
            maxRetries: 10,
        });
     }

     public exportLocalDataToAliyun() {

        const params = {

            tables: [
                {
                    tableName: 'User',
                    rows: this.retrieveUsers()
                }
            ],
        };

        this.client.batchWriteRow(params, function (err, data) {

            if (err) {
                console.log('error:', err);
                return;
            }

            console.log('success:', data);
        });
     }

     retrieveUsers () {
         const USER_USER_ID = UserTable.USER_USER_ID;
         const USER_LOGIN_NAME = UserTable.USER_LOGIN_NAME;
         const USER_PASSWORD = UserTable.USER_PASSWORD;
         const USER_NICK_NAME = UserTable.USER_NICK_NAME;
         const USER_FOLLOWUP_LIST = UserTable.USER_FOLLOWUP_LIST;
         const USER_FRIEND_LIST = UserTable.USER_FRIEND_LIST;
         const USER_PHOTO_ID = UserTable.USER_PHOTO_ID;
         const USER_TASK_LIST = UserTable.USER_TASK_LIST;
         const USER_MOTTO = UserTable.USER_MOTTO;

         const users: User[] = JSON.parse(localStorage.getItem('users')) || [];

         const rows: any[] = [];

         users.forEach( user => {
             const row = {
                type: 'PUT',
                condition: new TableStore.Condition(TableStore.RowExistenceExpectation.IGNORE, null),
                primaryKey: [{ USER_USER_ID: user.id + '' }, { USER_LOGIN_NAME: user.username }],
                attributeColumns: [{ USER_PASSWORD: user.password }, { USER_NICK_NAME: user.nickName }, { USER_FOLLOWUP_LIST: JSON.stringify(user.followUps) }],
                returnContent: { returnType: TableStore.ReturnType.Primarykey }
             };
             rows.push(row);

         });

         return rows;
     }
}
