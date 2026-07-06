class Api::V1::AuthenticationController < ApplicationController
  skip_before_action :verify_authenticity_token, only: [ :login, :register ]

  def options
    head :ok
  end

  def login
    credentials = params[:authentication] || params
    user = User.find_by(email: credentials[:email])

    if user&.authenticate(credentials[:password])
      token = encode_token(user_id: user.id)
      render json: {
        token: token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email
        }
      }, status: :ok
    else
      render json: { error: "Invalid email or password" }, status: :unauthorized
    end
  end

  def register
    user = User.new(user_params)

    if user.save
      render json: { message: "User registered successfully" }, status: :created
    else
      render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def user_params
    params.permit(:name, :email, :password, :password_confirmation, :age, :city, :role, :active)
  end

  def encode_token(payload)
    exp = 24.hours.from_now.to_i
    payload[:exp] = exp
    JWT.encode(payload, secret_key, "HS256")
  end

  def secret_key
    Rails.application.credentials.secret_key_base || Rails.application.secret_key_base
  end
end
