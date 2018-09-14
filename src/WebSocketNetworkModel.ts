type WebSocketMessage = {
	commandType: ResponseMessageType,
	request: any,
	response: any
};

enum ResponseMessageType {
	APPLY_MY_LEVEL = 'applyMyLevel'
}

enum SendMessageType {
	CHAT = 'chat',
	LOGIN = 'login',
	REFRESH = 'refresh'
}

export class WebSocketNetworkModel {

	private static readonly WEBSOCKET_PORT: number = 8001;

	private mHash: string;
	private mWebSocket: WebSocket | null;

	public constructor(hash: string) {
		this.mHash = hash;
		this.mWebSocket = null;
	}

	public connect() {
		let host = location.hostname;
		let url = `ws://${host}:${WebSocketNetworkModel.WEBSOCKET_PORT}`;

		this.mWebSocket = new WebSocket(url);
		this.mWebSocket.onopen = () => {
			this.callLogin();
			setInterval(() => {
				if (this.mWebSocket.readyState !== WebSocket.OPEN) {
					console.log('Disconnected');
				}
			}, 1000);
		}

		this.mWebSocket.onmessage = (message: MessageEvent) => {
			this.onMessageCallback(message);
		}
	}

	private onMessageCallback(message: MessageEvent) {
		let msgJson: WebSocketMessage = JSON.parse(message.data);
		switch (msgJson.commandType) {
			case ResponseMessageType.APPLY_MY_LEVEL:
				this.applyMyLevel(msgJson.response);
				break;
		}
	}

	private sendMessage(sendMessageType: SendMessageType, resource: any) {
		let sendMsg = {
			commandType: sendMessageType,
			resource: resource
		}
		this.mWebSocket.send(JSON.stringify(sendMsg));
	}

	private callLogin() {
		this.sendMessage(SendMessageType.LOGIN, {
			hash: this.mHash,
			channel: 'music'
		});
	}

	public callRefresh(ukey: string) {
		this.sendMessage(SendMessageType.REFRESH, ukey);
	}

	public callMusicChat(musicHash: string) {
		this.sendMessage(SendMessageType.CHAT, {
			hash: this.mHash,
			type: 'music',
			msg: musicHash
		});
	}

	private applyMyLevel(u: { coin: number }) {
		$('#lblCurrentCoin').text(u.coin);
		$('#lblRemainCoin').text(u.coin - 10);
		if (u.coin < 10) $('#lblRemainCoin').css('color', 'red');
	}
}