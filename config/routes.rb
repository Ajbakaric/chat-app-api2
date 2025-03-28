Rails.application.routes.draw do
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

  mount ActionCable.server => '/cable'

  namespace :api do
    namespace :v1 do
      resources :chat_rooms do
        resources :messages, only: [:index, :create, :update, :destroy]
      end
    end
  end
end
