class Users::RegistrationsController < Devise::RegistrationsController
  before_action :authenticate_user!, only: [:show, :update]

  respond_to :json
  include ActionController::MimeResponds

  skip_before_action :verify_authenticity_token, raise: false

  # 🚫 Prevent Devise from using session-based redirects
  def require_no_authentication
    # override Devise default behavior to avoid session usage
  end

  # 🔍 GET /profile
  def show
    unless current_user
      render json: { error: 'Unauthorized' }, status: :unauthorized
      return
    end

    render json: {
      user: {
        id: current_user.id,
        email: current_user.email,
        username: current_user.username,
        avatar_url: current_user.avatar.attached? ? url_for(current_user.avatar) : nil
      }
    }
  end

  # 📝 POST /signup
  def create
    build_resource(sign_up_params)

    resource.save
    if resource.persisted?
      if resource.active_for_authentication?
        token = Warden::JWTAuth::UserEncoder.new.call(resource, :user, nil).first

        render json: {
          user: {
            id: resource.id,
            email: resource.email,
            username: resource.username,
            avatar_url: resource.avatar.attached? ? url_for(resource.avatar) : nil
          },
          token: token
        }, status: :ok
      else
        render json: { error: 'Account not active' }, status: :unauthorized
      end
    else
      Rails.logger.debug "Signup failed due to: #{resource.errors.full_messages.inspect}"
      puts "Signup failed due to: #{resource.errors.full_messages.inspect}"

      render json: { errors: resource.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # ✏️ PUT /profile
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

  # 🔐 Used during sign up to return JWT token and user info
  def respond_with(resource, _opts = {})
    token = request.env['warden-jwt_auth.token']
    render json: {
      user: {
        id: resource.id,
        email: resource.email,
        username: resource.username,
        avatar_url: resource.avatar.attached? ? url_for(resource.avatar) : nil
      },
      token: token
    }, status: :ok
  end
end
