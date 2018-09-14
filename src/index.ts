import { Client } from "Client";

$(document).ready(() => {

	const key: string = $('script#script').data('key');
	const client = new Client(key);
	client.main();

});