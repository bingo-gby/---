function getTasks() {
  return new Promise((resolve, reject) => {
    wx.request({
      url: 'https://3148-202-46-41-90.ap.ngrok.io/tasks', // 替换为您的公网服务器地址
      method: 'GET',
      header: {
        'content-type': 'application/json; charset=utf-8'
      },
      success(res) {
        console.log(res.data);
        resolve(res.data);
      },
      fail(error) {
        console.error('Error:', error);
        reject(error);
      }
    });
  });
}

function addTask(content) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: 'https://3148-202-46-41-90.ap.ngrok.io/tasks', // 替换为您的公网服务器地址
      method: 'POST',
      data: {
        content: content
      },
      header: {
        'content-type': 'application/json; charset=utf-8'
      },
      success(res) {
        console.log(res.data);
        resolve(res.data);
      },
      fail(error) {
        console.error('Error:', error);
        reject(error);
      }
    });
  });
}

function getRandomTask() {
  return new Promise((resolve, reject) => {
    wx.request({
      url: 'https://3148-202-46-41-90.ap.ngrok.io/tasks/random', // 替换为您的公网服务器地址
      method: 'GET',
      header: {
        'content-type': 'application/json; charset=utf-8'
      },
      success(res) {
        console.log(res.data);
        resolve(res.data);
      },
      fail(error) {
        console.error('Error:', error);
        reject(error);
      }
    });
  });
}

function completeTask(taskId) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `https://3148-202-46-41-90.ap.ngrok.io/tasks/${taskId}/complete`, // 替换为您的公网服务器地址
      method: 'PUT',
      header: {
        'content-type': 'application/json; charset=utf-8'
      },
      success(res) {
        console.log(res.data);
        resolve();
      },
      fail(error) {
        console.error('Error:', error);
        reject(error);
      }
    });
  });
}

Page({
  data: {
    inputTask: '',
    finishedTasks: [],
    selectedTask: null,
    selectedTaskId: null
  },

  onLoad(){
    this.loadTasks();
  },

  loadTasks() {
    getTasks().then(tasks => {
      this.setData({ finishedTasks: tasks });
    });
  },

  onAddTask() {
    if (this.data.inputTask) {
      addTask(this.data.inputTask).then(() => {
        this.loadTasks();
        this.setData({ inputTask: '' });
      });
    }
  },

  onRandomTask() {
    getRandomTask().then(task => {
      this.setData({
        selectedTask: task.content,
        selectedTaskId: task.id
      });
    });
  },

  onTaskDone() {
    if (this.data.selectedTaskId !== null) {
      completeTask(this.data.selectedTaskId).then(() => {
        this.loadTasks();
        this.setData({ selectedTask: null, selectedTaskId: null });
      });
    }
  },

  onTaskAbandon() {
    this.setData({ selectedTask: null, selectedTaskId: null });
    this.onRandomTask();
  },

  onInputTaskChange(e) {
    this.setData({ inputTask: e.detail.value });
  }
});
