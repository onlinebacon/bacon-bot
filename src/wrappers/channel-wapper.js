export default class ChannelWrapper {
    constructor(client, id, channel) {
        this.client = client;
        this.id = id ?? channel?.id;
        this.channel = channel;
    }
    getChannelObject() {
        const { client, channel, id } = this;
        if (channel) return channel;
        return this.channel = client.channels.cache.get(id);
    }
    getName() {
        return this.getChannelObject().name;
    }
    equals(channel) {
        return this.id === channel.id;
    }
}
