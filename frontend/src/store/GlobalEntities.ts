import { action, computed, makeObservable, observable } from "mobx";
import GlobalApiHandlerInstance from "../api/GlobalApiHandlerInstance";
import { Task } from "@mui/icons-material";

class Entities {
    public _tasks: Task[] = [];
    public doneTasks: Task[] = [];
    public categories: Category[] = [];
    public userToken: string = "";
    public user: User = {
        id: undefined,
        name: undefined,
        email: undefined,
        role: undefined,
        created_at: undefined,
        updated_at: undefined,
    };
    public firstTask: Task | undefined = undefined;
    public users: User[] = [];

    constructor() {
        makeObservable(this, {
            _tasks: observable,
            doneTasks: observable,
            user: observable,
            categories: observable,
            firstTask: observable,
            users: observable,
            setFirstTask: action,
            loadTasks: action,
            createTask: action,
            tasks: computed,
            fetchUsers: action,
            deleteUser: action,
        });
    }

    get tasks() {
        return this._tasks;
    }

    @action loadTasks = async () => {
        const resp = await GlobalApiHandlerInstance.get(`/users/${this.user.id}`)
        this.Tasks(resp.data.data.tasks);
    }

    @action register = async (data: Object) => {
        try {
            const resp = await GlobalApiHandlerInstance.put('/register', data);
            return resp.data.data.message
        }
        catch {
            return "Sikertelen regisztráció"
        }
    }

    @action login = async (email: string, password: string) => {
        const loginResponse = await GlobalApiHandlerInstance.post(`/login`, { email, password });

        localStorage.setItem("userToken", loginResponse.data.data.token);

        const userDataResponse = await GlobalApiHandlerInstance.get('/user', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("userToken")}`
            }
        })

        this.user = userDataResponse.data;
        await GlobalEntities.loadTasks();
        await GlobalEntities.loadDoneTasks();

        if (GlobalEntities.user.role == "admin") {
            await GlobalEntities.fetchUsers();
        }

    }

    @action loadCategories = async () => {
        const resp = await GlobalApiHandlerInstance.get('/categories');

        this.categories = resp.data.data;
    }

    @action createTask = async (data: Object) => {
        const resp = await GlobalApiHandlerInstance.post('/tasks', data);

        await this.loadTasks();
        await this.loadDoneTasks();

        return resp;
    }

    @action updateTask = async (data: Task) => {
        const resp = await GlobalApiHandlerInstance.put(`/tasks/${data.id}`, data);

        if (resp.status === 200) {
            await this.loadTasks();
            await this.loadDoneTasks();
        }
        return resp;
    }

    @action Tasks = (tasks: Task[]) => {
        this._tasks = tasks.filter((element) => {
            return element.status != "kész"
        });

        this.setFirstTask();
    }

    @action setFirstTask = () => {
        this.firstTask = this._tasks[0];
    }

    @action loadDoneTasks = async () => {
        const resp = await GlobalApiHandlerInstance.get(`/tasks/today/${this.user.id}`);

        this.setDoneTasks(resp.data.data);
    }

    @action setDoneTasks = (tasks: Task[]) => {
        this.doneTasks = tasks;
    }

    @action updateUser = async (name: string, email: string, password: string) => {

        const data = {
            "name": name,
            "email": email,
        }

        const oldemail = this.user.email;

        try {
            await GlobalApiHandlerInstance.post(`/login`, { email: oldemail, password });
            const resp = await GlobalApiHandlerInstance.put(`/users/${this.user.id}`, data);
            this.user = resp.data.user;
            return resp.data.message;
        }
        catch {
            return 0;
        }

    }

    @action updateUserById = async (
        id: number,
        name: string,
        email: string,
        role: string,
    ) => {
        const data = {
            name: name,
            email: email,
            role: role,
        };

        try {
            const resp = await GlobalApiHandlerInstance.put(
                `/users/${id}`,
                data,
            );
            return resp.data.message;
        } catch {
            return 0;
        }
    };



    @action async fetchUsers() {
        console.log(localStorage.getItem("userToken"));
        const response = await GlobalApiHandlerInstance.get("/users", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("userToken")}`,
            },
        });
        this.users = response.data.data;
    }

    @action async deleteUser(id: number) {
        await GlobalApiHandlerInstance.delete(`/users/${id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("userToken")}`,
            },
        });
        this.users = this.users.filter((u) => u.id !== id);
    }

}

const GlobalEntities = new Entities();

if (localStorage.getItem("userToken")) {
    const userDataResponse = await GlobalApiHandlerInstance.get('/user', {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`
        }
    })

    GlobalEntities.user = userDataResponse.data;
    await GlobalEntities.loadTasks();
    await GlobalEntities.loadDoneTasks();
    if (GlobalEntities.user.role == "admin") {
        await GlobalEntities.fetchUsers();
    }
}

await GlobalEntities.loadCategories();

export default GlobalEntities