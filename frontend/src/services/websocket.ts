import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'

export class WebSocketService {
    private client: Client | null = null

    constructor(private onMessage: (msg: any) => void) { }

    connect() {
        this.client = new Client({
            webSocketFactory: () => new SockJS('/ws-queue'),
            onConnect: () => {
                console.log('Connected to WebSocket')
                this.client?.subscribe('/topic/queue', (message) => {
                    this.onMessage(JSON.parse(message.body))
                })
            },
            onStompError: (frame) => {
                console.error('Broker reported error: ' + frame.headers['message'])
                console.error('Additional details: ' + frame.body)
            },
        })

        this.client.activate()
    }

    disconnect() {
        this.client?.deactivate()
    }
}
