Rails.application.routes.draw do
  # Devise custom routes
  devise_for :users,
             path: '',
             path_names: {
               sign_in: 'login',
               sign_out: 'logout',
               registration: 'signup'
             },
             controllers: {
               sessions: 'users/sessions',
               registrations: 'users/registrations'
             }

  # Profile routes (custom user endpoint)
devise_scope :user do
  get '/profile', to: 'users/registrations#show'
  put '/profile', to: 'users/registrations#update'
end

  # ActionCable WebSocket endpoint
  mount ActionCable.server => '/cable'

  # API routes
  namespace :api do
    namespace :v1 do
      resources :chat_rooms, only: [:index, :create, :destroy] do
        resources :messages, only: [:index, :create, :update, :destroy]
      end
    end
  end
end
