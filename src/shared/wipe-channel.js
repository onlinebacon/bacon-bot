const wipeChannel = async (channel) => {
	for (;;) {
		const messages = await channel.messages.fetch({ limit: 10 });
		if (messages.size == 0) return;
		const promises = [];
		messages.forEach(message => {
			promises.push(message.delete());
		});
		await Promise.all(promises);
	}
};

export default wipeChannel;
