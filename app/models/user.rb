class User < ApplicationRecord
    has_many :sent_messages, class_name: "Message", foreign_key: "sender_id"
  end
  