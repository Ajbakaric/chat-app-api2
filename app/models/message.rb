class Message < ApplicationRecord
  belongs_to :chat_room
  has_one_attached :image # Add this line
end
