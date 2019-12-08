import Vue from 'vue';
import App from './App.vue';
import SettingsManager from './SettingsManager';

const manager = new SettingsManager();

(window as any).onHomeyReady = (homeyReady) => {
    manager.reload()
        .then(() => {
            homeyReady.ready();
            new Vue({
                data: manager,
                render: (h) => h(App),
            }).$mount('#app');
        })
        .catch((error) => {
            manager.error(`Failed to load configuration: ${error}`);
        });
}
