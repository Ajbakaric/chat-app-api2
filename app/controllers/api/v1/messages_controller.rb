class Api::V1::MessagesController < ApplicationController
    def index
      chat_room = ChatRoom.find(params[:chat_room_id])
      messages = chat_room.messages
      render json: messages
    end
  
    def create
      chat_room = ChatRoom.find(params[:chat_room_id])
      message = chat_room.messages.new(message_params)
      if message.save
        render json: message, status: :created
      else
        render json: message.errors, status: :unprocessable_entity
      end
    end
  
    private
    def message_params
      params.require(:message).permit(:content)
    end
  end
  