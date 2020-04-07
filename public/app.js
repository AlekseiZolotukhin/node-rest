new Vue({
    el: '#app',
    data() {
        return {
            isDark: true,
            show: true,
            taskTitle: '',
            tasks: []
        }
    },
    // get list of tasks on load
    created() {
        fetch('/api/tasks', {
            method: 'get'
        })
            .then(res => res.json())
            .then(tasks => {
                this.tasks = tasks;
            })
            .catch(e => console.log('Get error: ', e));
    },
    methods: {
        addTask() {
            const name = this.taskTitle.trim();
            if (!name) {
                return
            }
            fetch('/api/tasks', {
                method: 'post',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({name})
            })
                .then(res => res.json())
                .then(({task}) => {
                    this.tasks.push(task);
                })
                .catch(e => console.log('Add error: ', e));
            this.taskTitle = ''
        },
        // make task completed
        taskComplete(id) {
            // get request to api
            fetch('/api/tasks/' + id, {
                method: 'put',
                headers: {'Content-Type': 'application/json'}, // we need headers because we send data
                body: JSON.stringify({completed: true})
            })
                .then(res => res.json())
                .then(({task}) => {
                    const index = this.tasks.findIndex(t => t.id === task.id);
                    if (index) {
                        this.tasks[index].updatedAt = task.updatedAt
                    }
                })
                .catch(e => console.log('Add error:', e));
            this.taskTitle = ''
        },
        removeTask(id) {
            fetch('/api/tasks/' + id, {
                method: 'delete'
            })
                .then(() => {
                    this.tasks = this.tasks.filter(t => t.id !== id)
                })
                .catch(console.log(e))

        }
    },
    filters: {
        capitalize(value) {
            return value.toString().charAt(0).toUpperCase() + value.slice(1)
        },
        // make our date formatted
        date(value, withTime) {
            const options = {
                year: 'numeric',
                month: 'long',
                day: '2-digit'
            };
            if (withTime) {
                options.hour = '2-digit';
                options.minute = '2-digit';
                options.second = '2-digit';
            }
            return new Intl.DateTimeFormat('en-GB', options).format(new Date(value))
        }
    }
});