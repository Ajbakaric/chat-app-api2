Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resources :chat_rooms, only: [:index, :create, :show] do
        resources :messages, only: [:index, :create]
      end
    end
  end
end
