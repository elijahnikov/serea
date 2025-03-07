import { create } from "zustand";
import { persist } from "zustand/middleware";

type User = {
	id: string;
	name: string;
	image: string | null | undefined;
};

type ChannelStore = {
	// Track joined channels
	joinedChannels: Record<string, boolean>;

	// Track participants per channel
	channelParticipants: Record<string, User[]>;

	// Actions
	joinChannel: (channelId: string) => void;
	leaveChannel: (channelId: string) => void;
	setParticipants: (channelId: string, participants: User[]) => void;
};

export const useChannelStore = create<ChannelStore>()(
	persist(
		(set) => ({
			joinedChannels: {},
			channelParticipants: {},

			joinChannel: (channelId) =>
				set((state) => ({
					joinedChannels: { ...state.joinedChannels, [channelId]: true },
				})),

			leaveChannel: (channelId) =>
				set((state) => {
					const { [channelId]: _, ...rest } = state.joinedChannels;
					return { joinedChannels: rest };
				}),

			setParticipants: (channelId, participants) =>
				set((state) => ({
					channelParticipants: {
						...state.channelParticipants,
						[channelId]: participants,
					},
				})),
		}),
		{
			name: "channel-store",
			partialize: (state) => ({ joinedChannels: state.joinedChannels }),
		},
	),
);
