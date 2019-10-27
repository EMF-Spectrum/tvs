export async function callAPI(
	func: string,
	data?: _.Dictionary<any>,
): Promise<any> {
	let res, resData;
	try {
		res = await fetch(`/api/${func}`, {
			method: "POST",
			body: data && JSON.stringify(data),
			headers: {
				"Content-Type": "application/json",
			},
		});
		if (res.status != 204) {
			resData = await res.json();
		}
	} catch (e) {
		console.error(e);
		alert(`Failed to call ${func}! Check console.`);
		throw e;
	}
	if (res.status >= 300) {
		let { error, stack } = resData;
		console.error("Failed to %s:", func, error, stack);
		alert(`Failed to ${func}: ${error}`);
		throw new Error(error);
	}
	return resData;
}
