import api from './api';

export interface SlackChannelResponse {
    message: string;
    channelId: string;
}

class SlackService {
    /**
     * Manually create a Slack channel for an itinerary
     */
    async createChannel(itineraryId: string): Promise<SlackChannelResponse> {
        const response = await api.post<SlackChannelResponse>(`/slack/channel/${itineraryId}`);
        return response.data;
    }
}

export default new SlackService();
