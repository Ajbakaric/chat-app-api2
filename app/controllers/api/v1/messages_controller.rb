class Api::V1::MessagesController < ApplicationController
  before_action :authenticate_user!  # 🔐 Require JWT-based authentication
  include Rails.application.routes.url_helpers

  def index
    chat_room = ChatRoom.find(params[:chat_room_id])
    messages = chat_room.messages
    render json: messages
  end

  def create
    chat_room = ChatRoom.find(params[:chat_room_id])
    message = chat_room.messages.new(message_params)
    message.sender = current_user  # Assign sender directly from JWT-authenticated user

    Rails.logger.debug "🧠 Current user: #{current_user.inspect}"

    if message.save
      message_data = message.as_json
      message_data[:sender_avatar_url] = current_user.avatar.attached? ? url_for(current_user.avatar) : nil
      message_data[:image_url] = url_for(message.image) if message.image.attached?
      message_data[:sender_email] = current_user.email

      # 🔊 Broadcast the new message via ActionCable
      ChatRoomChannel.broadcast_to(chat_room, message_data)

      render json: message_data, status: :created
    else
      Rails.logger.error "❌ MESSAGE ERROR: #{message.errors.full_messages.join(', ')}"
      render json: { errors: message.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    message = Message.find(params[:id])
    if message.update(message_params)
      render json: message, status: :ok
    else
      render json: message.errors, status: :unprocessable_entity
    end
  end

  def destroy
    message = Message.find(params[:id])
    message.destroy
    head :no_content
  end

  private

  def message_params
    params.require(:message).permit(:content, :chat_room_id, :image) # 🚫 removed :user_id
  end
end
