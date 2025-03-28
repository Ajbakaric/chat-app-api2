Rails.application.routes.draw do
  mount ActionCable.server => '/cable'

  namespace :api do
    namespace :v1 do
      resources :chat_rooms do
        resources :messages, only: [:index, :create]
      end
    end
  end
end
