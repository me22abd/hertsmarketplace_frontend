/**
 * Messages page using Stream Chat
 * Replaces in-house messaging with Stream Chat UI components
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
  ChannelPreviewMessenger,
} from 'stream-chat-react';
import { getStreamClient, getStreamChannel } from '@/services/streamChat';
import { streamAPI } from '@/services/api';
import { useAuthStore } from '@/store/authStore';
import BottomNav from '@/components/BottomNav';
import Loading from '@/components/Loading';
import toast from 'react-hot-toast';
import type { Listing } from '@/types';
import 'stream-chat-react/dist/css/v2/index.css';

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
    
    // Check for channel_id in URL params
    const channelId = searchParams.get('channel');
    if (channelId) {
      loadChannelFromId(channelId);
    } else if (location.state?.listing) {
      // Legacy: If navigated from listing detail, create channel
      const listing = location.state.listing as Listing;
      handleCreateChannel(listing.id);
    }
  }, [searchParams]);

  const initializeStream = async () => {
    try {
      const streamClient = getStreamClient();
      if (!streamClient) {
        toast.error('Stream Chat not initialized. Please log in again.');
        navigate('/login');
        return;
      }
      setClient(streamClient);
    } catch (error) {
      console.error('Failed to initialize Stream:', error);
      toast.error('Failed to load chat');
    } finally {
      setIsLoading(false);
    }
  };

  const loadChannelFromId = async (channelId: string) => {
    try {
      setIsLoading(true);
      const streamChannel = await getStreamChannel(channelId);
      setActiveChannel(streamChannel);
    } catch (error: any) {
      toast.error('Failed to load channel');
      // Remove invalid channel_id from URL
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
      // Update URL with channel_id
      navigate(`/messages?channel=${response.channel_id}`, { replace: true });
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to create channel');
    } finally {
      setIsLoading(false);
    }
  };

  const currentUserId = user ? String(user.id) : null;

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

  const otherUserInitials = useMemo(() => {
    if (!otherUser) return 'U';
    const name: string = otherUser.name || otherUser.email || '';
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    const initials = parts
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase())
      .join('');
    return initials || 'U';
  }, [otherUser]);

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

  // Show channel list and active channel
  return (
    <div className="min-h-screen bg-white pb-20">
      <div className="sticky top-0 bg-white border-b border-gray-100 z-20">
        <div className="w-full max-w-md mx-auto px-4 py-3">
          <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
        </div>
      </div>

      <Chat client={client}>
        <ChannelList
          filters={{ members: { $in: [String(user?.id)] } }}
          sort={{ last_message_at: -1 }}
          Preview={ChannelPreviewMessenger}
          EmptyStateIndicator={() => (
            <div className="flex flex-col items-center justify-center py-16 px-4">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                <MessageCircle size={32} className="text-gray-400" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">No Messages Yet</h2>
              <p className="text-gray-500 text-center mb-6">
                Start a conversation with a seller
              </p>
              <button
                onClick={() => navigate('/home')}
                className="px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-colors"
              >
                Start Chatting
              </button>
            </div>
          )}
        />
        <Channel channel={activeChannel}>
          <Window>
            {/* Custom Header */}
            {activeChannel && (
              <div className="sticky top-0 bg-white border-b border-gray-100 z-20">
                <div className="w-full max-w-md mx-auto px-4 py-3">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setActiveChannel(null)}
                      className="touch-target -ml-2"
                    >
                      <ArrowLeft size={24} className="text-gray-900" />
                    </button>
                    <button
                      type="button"
                      disabled={!otherUser}
                      onClick={() => {
                        if (!otherUser) return;
                        // Navigate to public profile view for the other user
                        navigate(`/seller/${otherUser.id}`);
                      }}
                      className="flex-1 flex items-center gap-3 text-left disabled:opacity-60"
                    >
                      <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center text-sm font-semibold overflow-hidden">
                        {otherUser?.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={otherUser.image}
                            alt={otherUser.name || 'Profile'}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          otherUserInitials
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h2 className="font-semibold text-gray-900 truncate">
                          {otherUser?.name || otherUser?.email || 'Chat'}
                        </h2>
                        {activeChannel?.data?.listing?.title && (
                          <p className="text-xs text-gray-500 truncate">
                            {activeChannel.data.listing.title}
                          </p>
                        )}
                      </div>
                      <span className="text-xs font-semibold text-primary">
                        View profile
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Stream Message List */}
            <MessageList />

            {/* Stream Message Input */}
            <MessageInput />
          </Window>
        </Channel>
      </Chat>

      <BottomNav />
    </div>
  );
}
