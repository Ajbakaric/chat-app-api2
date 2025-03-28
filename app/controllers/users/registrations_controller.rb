class Users::RegistrationsController < Devise::RegistrationsController
  before_action :authenticate_user!, only: [:show, :update]

  respond_to :json

  def show
    render json: {
      user: {
        id: current_user.id,
        email: current_user.email,
        username: current_user.username,
        avatar_url: current_user.avatar.attached? ? url_for(current_user.avatar) : nil
      }
    }
  end

  def update
    if current_user.update(account_update_params)
      render json: {
        user: {
          id: current_user.id,
          email: current_user.email,
          username: current_user.username,
          avatar_url: current_user.avatar.attached? ? url_for(current_user.avatar) : nil
        }
      }, status: :ok
    else
      render json: { errors: current_user.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def sign_up_params
    params.require(:user).permit(:email, :password, :username, :avatar)
  end

  def account_update_params
    params.require(:user).permit(:email, :password, :current_password, :username, :avatar)
  end

  def respond_with(resource, _opts = {})
    render json: {
      user: {
        id: resource.id,
        email: resource.email,
        username: resource.username,
        avatar_url: resource.avatar.attached? ? url_for(resource.avatar) : nil
      }
    }, status: :ok
  end
end
