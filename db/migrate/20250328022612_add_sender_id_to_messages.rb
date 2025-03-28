class AddSenderIdToMessages < ActiveRecord::Migration[7.1]
  def change
    add_column :messages, :sender_id, :integer
  end
end
