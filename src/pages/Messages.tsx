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
import { streamAPI, profileAPI, listingsAPI } from '@/services/api';
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
  const [roleLabel, setRoleLabel] = useState<string | null>(null);

  const members = Object.values(channel.state?.members || {}) as any[];
  const currentUserId = String(user?.id || '');
  const otherMember = members.find((m: any) => m.user?.id !== currentUserId) || members[0];
  const otherUser = otherMember?.user;
  const otherUserId = otherUser?.id;

  // Fetch profile and determine role from backend API
  useEffect(() => {
    if (!otherUserId) return;

    const fetchProfileAndRole = async () => {
      try {
        // Extract listing ID from channel ID (format: listing_<listing_id>_<id1>_<id2>)
        const channelId = channel.id || channel.cid?.split(':')[1] || '';
        const listingIdMatch = channelId.match(/listing_(\d+)_/);
        
        if (listingIdMatch) {
          const listingId = parseInt(listingIdMatch[1], 10);
          
          // Fetch listing to determine seller
          const listing = await listingsAPI.get(listingId);
          const sellerId = String(listing.seller?.id || listing.seller);
          const isCurrentUserSeller = sellerId === currentUserId;
          
          // Fetch profile
          const profile = await profileAPI.get(Number(otherUserId));
          
          // Only use profile name if it's a non-empty string (not placeholder)
          const profileNameValue = profile?.name?.trim();
          if (profileNameValue && profileNameValue.length > 0) {
            setProfileName(profileNameValue);
          } else {
            // If no profile name, use email from Stream Chat user object
            setProfileName(null); // Will fall back to email in displayName logic
          }
          
          if (profile?.profile_photo || profile?.avatar_url) {
            setProfileImage(profile.profile_photo || profile.avatar_url);
          }
          
          // Set role label
          setRoleLabel(isCurrentUserSeller ? 'Buyer' : 'Seller');
        } else {
          // Fallback: just fetch profile without role
          const profile = await profileAPI.get(Number(otherUserId));
          
          // Only use profile name if it's a non-empty string
          const profileNameValue = profile?.name?.trim();
          if (profileNameValue && profileNameValue.length > 0) {
            setProfileName(profileNameValue);
          } else {
            setProfileName(null); // Will fall back to email
          }
          
          if (profile?.profile_photo || profile?.avatar_url) {
            setProfileImage(profile.profile_photo || profile.avatar_url);
          }
        }
      } catch (error) {
        // If profile fetch fails, fall back to Stream data
        console.warn('Failed to fetch profile for user', otherUserId, error);
      }
    };

    fetchProfileAndRole();
  }, [otherUserId, channel, currentUserId]);

  // Determine display name: prefer backend profile name (if real), then email, then fallback
  // Skip Stream's otherUser.name as it might be placeholder like "John Doe"
  const displayName: string =
    profileName ||
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
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold text-gray-900 truncate">{displayName}</p>
          {roleLabel && (
            <span className="text-[10px] font-medium text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded whitespace-nowrap">
              {roleLabel}
            </span>
          )}
        </div>
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
  const [activeChatProfile, setActiveChatProfile] = useState<{ name?: string; image?: string; role?: 'seller' | 'buyer' } | null>(null);

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

  // Determine if current user is seller or buyer, and fetch profile
  useEffect(() => {
    if (!otherUser?.id || !activeChannel || !currentUserId) {
      setActiveChatProfile(null);
      return;
    }

    const fetchListingAndProfile = async () => {
      try {
        // Extract listing ID from channel ID (format: listing_<listing_id>_<id1>_<id2>)
        const channelId = activeChannel.id || activeChannel.cid?.split(':')[1] || '';
        const listingIdMatch = channelId.match(/listing_(\d+)_/);
        
        if (listingIdMatch) {
          const listingId = parseInt(listingIdMatch[1], 10);
          
          // Fetch listing to determine seller
          const listing = await listingsAPI.get(listingId);
          const sellerId = String(listing.seller?.id || listing.seller);
          const isCurrentUserSeller = sellerId === currentUserId;
          
          // Fetch the other user's profile
          const profile = await profileAPI.get(Number(otherUser.id));
          
          // Only use profile name if it's a non-empty string (not placeholder)
          const profileNameValue = profile?.name?.trim();
          
          setActiveChatProfile({
            name: (profileNameValue && profileNameValue.length > 0) ? profileNameValue : undefined,
            image: profile?.profile_photo || profile?.avatar_url || undefined,
            role: isCurrentUserSeller ? 'buyer' : 'seller', // Other user's role
          });
        } else {
          // Fallback: just fetch profile without role
          const profile = await profileAPI.get(Number(otherUser.id));
          const profileNameValue = profile?.name?.trim();
          
          setActiveChatProfile({
            name: (profileNameValue && profileNameValue.length > 0) ? profileNameValue : undefined,
            image: profile?.profile_photo || profile?.avatar_url || undefined,
          });
        }
      } catch (error) {
        console.warn('Failed to fetch listing/profile for active chat', error);
        // Fallback: try to get profile without listing
        try {
          const profile = await profileAPI.get(Number(otherUser.id));
          const profileNameValue = profile?.name?.trim();
          
          setActiveChatProfile({
            name: (profileNameValue && profileNameValue.length > 0) ? profileNameValue : undefined,
            image: profile?.profile_photo || profile?.avatar_url || undefined,
          });
        } catch (profileError) {
          setActiveChatProfile(null);
        }
      }
    };

    fetchListingAndProfile();
  }, [otherUser?.id, activeChannel, currentUserId]);

  // Use profile name if available, otherwise use email (skip Stream's name as it might be placeholder)
  const displayName = activeChatProfile?.name || otherUser?.email || 'Student';
  const displayImage = activeChatProfile?.image || otherUser?.image;
  const roleLabel = activeChatProfile?.role === 'seller' ? 'Seller' : activeChatProfile?.role === 'buyer' ? 'Buyer' : null;

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
                              <div className="flex items-center gap-2">
                                <h2 className="text-sm font-semibold text-gray-900 truncate">
                                  {displayName}
                                </h2>
                                {roleLabel && (
                                  <span className="text-[10px] font-medium text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                                    {roleLabel}
                                  </span>
                                )}
                              </div>
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