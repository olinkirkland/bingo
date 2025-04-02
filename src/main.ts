import mixpanel from 'mixpanel-browser';
import { createApp } from 'vue';
import App from './App.vue';

createApp(App).mount('#app');

// Initialize Mixpanel
// if it's running from localhost, don't track the page load
mixpanel.init('23ddf5bf4f2cc1112aa8324dc018c950');
if (window.location.hostname !== 'localhost') {
    console.warn('Mixpanel tracked the page load!');
    mixpanel.track('page-load');
} else {
    console.warn('Accessing from localhost; Mixpanel is disabled.');
}
