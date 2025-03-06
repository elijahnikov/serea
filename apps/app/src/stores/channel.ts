import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ChannelState {
	currentChannelId: string | null;
	joinChannel: (channelId: string) => void;
	leaveChannel: () => void;
}

export const useChannelStore = create<ChannelState>()(
	persist(
		(set) => ({
			currentChannelId: null,
			joinChannel: (channelId) => set({ currentChannelId: channelId }),
			leaveChannel: () => set({ currentChannelId: null }),
		}),
		{
			name: "channel-storage", // unique name for the localStorage key
		},
	),
);
