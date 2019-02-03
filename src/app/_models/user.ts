export class User {
    id: string;
    username: string;
    password: string;
    nickName: string;
    followUps: Array<string>;
    friends: Array<string>;
    tasks: Array<string>;
    motto: string;
    photo_id: string;
    profileUrl: string;
    photo: string;
    createTime: Date;
}
