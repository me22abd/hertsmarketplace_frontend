import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Send, MoreVertical, Search } from 'lucide-react';
import { messagesAPI } from '@/services/api';
import type { Conversation, Message, Listing } from '@/types';
import BottomNav from '@/components/BottomNav';
import Loading from '@/components/Loading';
import { formatRelativeTime, getInitials, formatPrice } from '@/utils/helpers';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';

export default function Messages() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthStore();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageContent, setMessageContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    loadConversations();
    
    // If navigated from listing detail, show new message interface
    if (location.state?.listing) {
      const listing = location.state.listing as Listing;
      // Create a pseudo-conversation for the new chat
      const newConversation: Conversation = {
        listing,
        other_user: listing.seller,
        last_message: {
          id: 0,
          listing: listing.id,
          listing_title: listing.title,
          sender: listing.seller,
          recipient: user!,
          content: '',
          is_read: true,
          created_at: new Date().toISOString(),
        },
        unread_count: 0,
      };
      setSelectedConversation(newConversation);
    }
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation.listing.id);
    }
  }, [selectedConversation]);

  const loadConversations = async () => {
    try {
      setIsLoading(true);
      const data = await messagesAPI.conversations();
      setConversations(data);
    } catch (error) {
      toast.error('Failed to load conversations');
    } finally {
      setIsLoading(false);
    }
  };

  const loadMessages = async (listingId: number) => {
    try {
      const data = await messagesAPI.list(listingId);
      setMessages(data.results || []);
    } catch (error) {
      // If no messages exist yet, that's okay
      setMessages([]);
    }
  };

  const handleSendMessage = async () => {
    if (!messageContent.trim() || !selectedConversation) return;

    try {
      setIsSending(true);
      await messagesAPI.send(selectedConversation.listing.id, messageContent);
      setMessageContent('');
      await loadMessages(selectedConversation.listing.id);
      await loadConversations();
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to send message');
    } finally {
      setIsSending(false);
    }
  };

  // Conversation List View
  if (!selectedConversation) {
    return (
      <div className="min-h-screen bg-white pb-20">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 z-20">
          <div className="w-full max-w-md mx-auto px-4 py-3">
            <h1 className="text-2xl font-bold text-gray-900 mb-3">Messages</h1>
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search messages..."
                className="w-full pl-10 pr-4 py-2.5 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>
        </div>

        <div className="w-full max-w-md mx-auto">
          {isLoading ? (
            <Loading />
          ) : conversations.length === 0 ? (
            <div className="text-center py-16 px-4">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                <Send size={32} className="text-gray-400" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">No Messages Yet</h2>
              <p className="text-gray-500">
                Start a conversation with a seller
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {conversations.map((conversation) => (
                <button
                  key={`${conversation.listing.id}-${conversation.other_user.id}`}
                  onClick={() => setSelectedConversation(conversation)}
                  className="w-full px-4 py-4 flex items-start gap-3 active:bg-gray-50 transition-colors"
                >
                  {(() => {
                    // Get seller profile photo - try avatar, avatar_url, or profile_photo
                    const profile = conversation.other_user.profile;
                    const profilePhoto = profile.avatar || profile.avatar_url || profile.profile_photo;
                    return profilePhoto ? (
                      <img
                        src={profilePhoto}
                        alt={conversation.other_user.profile.name}
                        className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                        onError={(e) => {
                          // Fallback to initials if image fails to load
                          const initials = getInitials(conversation.other_user.profile.name);
                          e.currentTarget.style.display = 'none';
                          if (e.currentTarget.parentElement) {
                            e.currentTarget.parentElement.innerHTML = `<div class="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-semibold flex-shrink-0">${initials}</div>`;
                          }
                        }}
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-semibold flex-shrink-0">
                        {getInitials(conversation.other_user.profile.name)}
                      </div>
                    );
                  })()}
                  <div className="flex-1 min-w-0 text-left">
                    <div className="flex items-start justify-between mb-1">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {conversation.other_user.profile.name}
                      </h3>
                      {conversation.last_message && (
                        <span className="text-xs text-gray-400 flex-shrink-0 ml-2">
                          {formatRelativeTime(conversation.last_message.created_at)}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 truncate mb-1">
                      {conversation.listing.title}
                    </p>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-500 truncate">
                        {conversation.last_message?.content || 'Start a conversation'}
                      </p>
                      {conversation.unread_count > 0 && (
                        <span className="ml-2 flex-shrink-0 w-5 h-5 bg-primary text-white text-xs rounded-full flex items-center justify-center font-semibold">
                          {conversation.unread_count}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <BottomNav />
      </div>
    );
  }

  // Chat View
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Chat Header */}
      <div className="sticky top-0 bg-white border-b border-gray-100 z-20">
        <div className="w-full max-w-md mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={() => setSelectedConversation(null)} className="touch-target -ml-2">
                <ArrowLeft size={24} className="text-gray-900" />
              </button>
              {(() => {
                // Get seller profile photo - try avatar, avatar_url, or profile_photo
                const profile = selectedConversation.other_user.profile;
                const profilePhoto = profile.avatar || profile.avatar_url || profile.profile_photo;
                return profilePhoto ? (
                  <img
                    src={profilePhoto}
                    alt={selectedConversation.other_user.profile.name}
                    className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                    onError={(e) => {
                      // Fallback to initials if image fails to load
                      const initials = getInitials(selectedConversation.other_user.profile.name);
                      e.currentTarget.style.display = 'none';
                      if (e.currentTarget.parentElement) {
                        e.currentTarget.parentElement.innerHTML = `<div class="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-semibold text-sm flex-shrink-0">${initials}</div>`;
                      }
                    }}
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-semibold text-sm flex-shrink-0">
                    {getInitials(selectedConversation.other_user.profile.name)}
                  </div>
                );
              })()}
              <div>
                <h2 className="font-semibold text-gray-900">
                  {selectedConversation.other_user.profile.name || selectedConversation.other_user.email}
                </h2>
                <p className="text-xs text-gray-500">
                  {selectedConversation.other_user.profile.course || 'University of Hertfordshire'}
                </p>
              </div>
            </div>
            <button className="touch-target -mr-2">
              <MoreVertical size={20} className="text-gray-700" />
            </button>
          </div>
        </div>
      </div>

      {/* Listing Info Banner */}
      <div className="w-full max-w-md mx-auto px-4 py-3 bg-gray-50 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-white flex items-center justify-center overflow-hidden flex-shrink-0">
            {(() => {
              // Try image_url first (cloud storage), then primary_image, then image
              const imageUrl = selectedConversation.listing.image_url || 
                              (selectedConversation.listing as any).primary_image || 
                              selectedConversation.listing.image;
              return imageUrl ? (
                <img
                  src={imageUrl}
                  alt={selectedConversation.listing.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback to emoji if image fails to load
                    e.currentTarget.style.display = 'none';
                    if (e.currentTarget.parentElement) {
                      e.currentTarget.parentElement.innerHTML = '<span class="text-2xl">📦</span>';
                    }
                  }}
                />
              ) : (
                <span className="text-2xl">📦</span>
              );
            })()}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 text-sm truncate">
              {selectedConversation.listing.title}
            </h3>
            <p className="text-primary font-bold text-sm">
              {formatPrice(selectedConversation.listing.price)}
            </p>
          </div>
          <button
            onClick={() => navigate(`/listings/${selectedConversation.listing.id}`)}
            className="text-xs text-primary font-medium flex-shrink-0"
          >
            View
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="w-full max-w-md mx-auto px-4 py-4 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400 text-sm">No messages yet. Say hello!</p>
            </div>
          ) : (
            messages.map((message, index) => {
              // Use sender_id for alignment (backend returns this)
              const myId = Number(user?.id);
              const senderId = Number((message as any).sender_id || message.sender?.id);
              const isMine = senderId === myId;
              
              // Debug log for first message only
              if (index === 0) {
                console.log({ myId, senderId, isMine, msg: message });
              }
              
              // Check if previous message is from same sender (for grouping)
              const prevMessage = index > 0 ? messages[index - 1] : null;
              const prevSenderId = prevMessage ? Number((prevMessage as any).sender_id || prevMessage.sender?.id) : null;
              const isGrouped = prevSenderId === senderId;
              
              return (
                <div
                  key={message.id}
                  className={`flex w-full ${isMine ? 'justify-end' : 'justify-start'} ${isGrouped ? 'mt-1' : 'mt-2'}`}
                >
                  <div className={`flex flex-col ${isMine ? 'items-end' : 'items-start'} max-w-[70%]`}>
                    <div
                      className={`rounded-2xl px-4 py-2.5 ${
                        isMine
                          ? 'bg-primary text-white rounded-br-sm'
                          : 'bg-gray-100 text-gray-900 rounded-bl-sm'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">
                        {message.content}
                      </p>
                    </div>
                    {/* Show timestamp only if not grouped or is last message */}
                    {(!isGrouped || index === messages.length - 1) && (
                      <p className={`text-xs mt-1 px-2 ${isMine ? 'text-gray-400' : 'text-gray-400'}`}>
                        {formatRelativeTime(message.created_at)}
                      </p>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Message Input */}
      <div className="sticky bottom-0 bg-white border-t border-gray-100">
        <div className="w-full max-w-md mx-auto px-4 py-3">
          <div className="flex items-end gap-2">
            <textarea
              value={messageContent}
              onChange={(e) => setMessageContent(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="Type a message..."
              rows={1}
              className="flex-1 resize-none px-4 py-3 bg-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 max-h-32"
              style={{ minHeight: '44px' }}
            />
            <button
              onClick={handleSendMessage}
              disabled={!messageContent.trim() || isSending}
              className="w-11 h-11 bg-primary text-white rounded-full flex items-center justify-center disabled:opacity-50 flex-shrink-0"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
