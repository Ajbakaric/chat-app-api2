class Api::V1::ChatRoomsController < ApplicationController
    def index
      render json: ChatRoom.all
    end
  
    def create
      chat_room = ChatRoom.new(chat_room_params)
      if chat_room.save
        render json: chat_room, status: :created
      else
        render json: chat_room.errors, status: :unprocessable_entity
      end
    end
  
    def show
      chat_room = ChatRoom.find(params[:id])
      render json: chat_room
    end
    def destroy
      chat_room = ChatRoom.find(params[:id])
      chat_room.destroy
      head :no_content
    end
    
    private
    def chat_room_params
      params.require(:chat_room).permit(:name)
    end
  end
  