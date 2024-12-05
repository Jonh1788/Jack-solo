import Echo from 'laravel-echo';
import { broadcaster } from 'laravel-echo-api-gateway';
import Pusher from 'pusher-js';
window.Pusher = Pusher;

window.Echo = new Echo({
    broadcaster,
    host: 'wss://z7ywnmazj8.execute-api.sa-east-1.amazonaws.com/prod'
});
