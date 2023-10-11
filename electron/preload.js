const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
    read: async (target) => {
        const res = await ipcRenderer.invoke('res', target)
        return [res]
    },
    find: async (target) => {
        const file = await ipcRenderer.invoke('find', target)
        return file
    }
})