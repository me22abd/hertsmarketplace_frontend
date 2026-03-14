/**
 * Messages page using Stream Chat
 * Premium-style header showing other user's profile + listing
 */
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { ArrowLeft, MessageCircle } from 'lucide-react';
import {
  Chat,
  Channel,
  Window,
  MessageList,
  MessageInput,
  ChannelList,
  useChannelStateContext,
} from 'stream-chat-react';
import { getStreamClient, getStreamChannel } from '@/services/streamChat';
import { streamAPI, profileAPI } from '@/services/api';
import { useAuthStore } from '@/store/authStore';
import BottomNav from '@/components/BottomNav';
import Loading from '@/components/Loading';
import type { Listing } from '@/types';
import 'stream-chat-react/dist/css/v2/index.css';

function QuickReplies() {
  const { channel } = useChannelStateContext();

  const handleClick = async (text: string) => {
    if (!channel) return;
    try {
      await channel.sendMessage({ text });
    } catch {
      // ignore – main input still works
    }
  };

  const options = ["I'll be there", 'Okay, thanks', 'Yes, that works'];

  return (
    <div className="px-3 pb-2">
      <div className="flex gap-2 overflow-x-auto no-scrollbar">
        {options.map((text) => (
          <button
            key={text}
            type="button"
            onClick={() => handleClick(text)}
            className="px-3 py-1 rounded-full bg-white border border-gray-200 text-[11px] text-gray-700 shadow-xs hover:bg-gray-50 whitespace-nowrap"
          >
            {text}
          </button>
        ))}
      </div>
    </div>
  );
}

function InboxPreview({ channel }: { channel: any }) {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [profileName, setProfileName] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const members = Object.values(channel.state?.members || {}) as any[];
  const currentUserId = String(user?.id || '');
  const otherMember = members.find((m: any) => m.user?.id !== currentUserId) || members[0];
  const otherUser = otherMember?.user;
  const otherUserId = otherUser?.id;

  // Fetch profile from backend API
  useEffect(() => {
    if (!otherUserId) return;

    const fetchProfile = async () => {
      try {
        const profile = await profileAPI.get(Number(otherUserId));
        if (profile?.name) {
          setProfileName(profile.name);
        }
        if (profile?.profile_photo || profile?.avatar_url) {
          setProfileImage(profile.profile_photo || profile.avatar_url);
        }
      } catch (error) {
        // If profile fetch fails, fall back to Stream data
        console.warn('Failed to fetch profile for user', otherUserId, error);
      }
    };

    fetchProfile();
  }, [otherUserId]);

  // Determine display name: prefer backend profile, then Stream name, then email, then fallback
  const displayName: string =
    profileName ||
    (otherUser?.name as string) ||
    (otherUser?.email as string) ||
    (otherUser?.id ? `Student ${otherUser.id}` : 'Student');

  const initials = displayName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('') || 'U';

  const avatarImage = profileImage || otherUser?.image;

  const lastMessageText = channel.state?.messages?.length
    ? channel.state.messages[channel.state.messages.length - 1].text || ''
    : '';

  const handleClick = () => {
    const channelId = channel.id || channel.cid?.split(':')[1];
    if (channelId) {
      navigate(`/messages?channel=${channelId}`);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors border-b border-gray-50"
    >
      <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-semibold overflow-hidden">
        {avatarImage ? (
          <img src={avatarImage} alt={displayName} className="w-full h-full object-cover" />
        ) : (
          initials
        )}
      </div>
      <div className="flex-1 min-w-0 text-left">
        <p className="text-sm font-semibold text-gray-900 truncate">{displayName}</p>
        {lastMessageText ? (
          <p className="text-[11px] text-gray-500 truncate">{lastMessageText}</p>
        ) : (
          <p className="text-[11px] text-gray-400 truncate">No messages yet</p>
        )}
      </div>
    </button>
  );
}

export default function Messages() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { user } = useAuthStore();
  const [client, setClient] = useState<any>(null);
  const [activeChannel, setActiveChannel] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeStream();

    const channelId = searchParams.get('channel');
    if (channelId) {
      loadChannelFromId(channelId);
    } else if (location.state?.listing) {
      const listing = location.state.listing as Listing;
      handleCreateChannel(listing.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const initializeStream = async () => {
    try {
      const streamClient = getStreamClient();
      if (!streamClient) {
        navigate('/login');
        return;
      }
      setClient(streamClient);
    } catch {
      // ignore, UI will show generic error
    } finally {
      setIsLoading(false);
    }
  };

  const loadChannelFromId = async (channelId: string) => {
    try {
      setIsLoading(true);
      const streamChannel = await getStreamChannel(channelId);
      setActiveChannel(streamChannel);
    } catch {
      navigate('/messages', { replace: true });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateChannel = async (listingId: number) => {
    try {
      setIsLoading(true);
      const response = await streamAPI.createChannel(listingId);
      const streamChannel = await getStreamChannel(response.channel_id);
      setActiveChannel(streamChannel);
      navigate(`/messages?channel=${response.channel_id}`, { replace: true });
    } catch {
      // toast handled in other version; keep silent here
    } finally {
      setIsLoading(false);
    }
  };

  const currentUserId = user ? String(user.id) : null;
  const [activeChatProfile, setActiveChatProfile] = useState<{ name?: string; image?: string } | null>(null);

  const otherUser = useMemo(() => {
    if (!activeChannel || !currentUserId) return null;
    try {
      const members = Object.values(activeChannel.state?.members || {}) as any[];
      const otherMember = members.find((m) => m.user?.id !== currentUserId);
      return otherMember?.user || null;
    } catch {
      return null;
    }
  }, [activeChannel, currentUserId]);

  // Fetch profile for active chat's other user
  useEffect(() => {
    if (!otherUser?.id) {
      setActiveChatProfile(null);
      return;
    }

    const fetchProfile = async () => {
      try {
        const profile = await profileAPI.get(Number(otherUser.id));
        setActiveChatProfile({
          name: profile?.name || undefined,
          image: profile?.profile_photo || profile?.avatar_url || undefined,
        });
      } catch (error) {
        console.warn('Failed to fetch profile for active chat user', otherUser.id, error);
        setActiveChatProfile(null);
      }
    };

    fetchProfile();
  }, [otherUser?.id]);

  const displayName = activeChatProfile?.name || otherUser?.name || otherUser?.email || 'Student';
  const displayImage = activeChatProfile?.image || otherUser?.image;

  const otherUserInitials = useMemo(() => {
    if (!displayName) return 'U';
    const parts = displayName.trim().split(' ');
    const initials = parts
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase())
      .join('');
    return initials || 'U';
  }, [displayName]);

  if (isLoading && !client) {
    return <Loading fullScreen />;
  }

  if (!client) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">Chat not available. Please log in again.</p>
          <button
            onClick={() => navigate('/login')}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-lg"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  const showInbox = !activeChannel;

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="w-full max-w-md mx-auto h-[calc(100vh-4.5rem)] flex flex-col">
        {showInbox ? (
          <div className="pt-3 px-4 pb-2">
            <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
            <p className="text-xs text-gray-500 mt-1">
              Chat with sellers to arrange safe, in-person meetups.
            </p>
          </div>
        ) : null}

        <div className="flex-1 px-3">
          <div className="bg-white rounded-3xl shadow-md border border-gray-100 overflow-hidden h-full flex flex-col">
            <Chat client={client}>
              {showInbox ? (
                <div className="flex-1 flex flex-col">
                  <div className="border-b border-gray-100 bg-white">
                    <ChannelList
                      filters={{ members: { $in: [String(user?.id)] } }}
                      sort={{ last_message_at: -1 }}
                      Preview={InboxPreview}
                      EmptyStateIndicator={() => (
                        <div className="flex flex-col items-center justify-center py-12 px-4">
                          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-50 flex items-center justify-center">
                            <MessageCircle size={28} className="text-gray-400" />
                          </div>
                          <h2 className="text-base font-bold text-gray-900 mb-1">
                            No messages yet
                          </h2>
                          <p className="text-xs text-gray-500 text-center mb-4">
                            Start a conversation with a seller from any listing.
                          </p>
                          <button
                            onClick={() => navigate('/home')}
                            className="px-4 py-2 bg-primary text-white rounded-xl text-xs font-semibold hover:bg-primary/90 transition-colors"
                          >
                            Browse listings
                          </button>
                        </div>
                      )}
                    />
                  </div>
                </div>
              ) : (
                <Channel channel={activeChannel}>
                  <Window>
                    <div className="flex flex-col h-full bg-gradient-to-b from-slate-50 to-slate-100">
                      <div className="bg-white/90 backdrop-blur border-b border-gray-100">
                        <div className="px-4 py-3 flex items-center gap-3">
                          <button
                            onClick={() => {
                              setActiveChannel(null);
                              navigate('/messages', { replace: true });
                            }}
                            className="touch-target -ml-2"
                          >
                            <ArrowLeft size={22} className="text-gray-900" />
                          </button>
                          <button
                            type="button"
                            disabled={!otherUser}
                            onClick={() => {
                              if (!otherUser) return;
                              navigate(`/seller/${otherUser.id}`);
                            }}
                            className="flex-1 flex items-center gap-3 text-left disabled:opacity-60"
                          >
                            <div className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center text-xs font-semibold overflow-hidden">
                              {displayImage ? (
                                <img
                                  src={displayImage}
                                  alt={displayName}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                otherUserInitials
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h2 className="text-sm font-semibold text-gray-900 truncate">
                                {displayName}
                              </h2>
                              {activeChannel?.data?.listing?.title && (
                                <p className="text-[11px] text-gray-500 truncate">
                                  {activeChannel.data.listing.title}
                                </p>
                              )}
                            </div>
                            <span className="text-[11px] font-semibold text-primary">
                              View profile
                            </span>
                          </button>
                        </div>
                      </div>

                      <div className="flex-1 px-1 pt-1">
                        <MessageList />
                      </div>

                      <QuickReplies />

                      <div className="border-t border-gray-100 bg-white px-2 pb-2">
                        <MessageInput focus />
                      </div>
                    </div>
                  </Window>
                </Channel>
              )}
            </Chat>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}