class EmployeesController < ApplicationController
  before_action :authenticate_request, unless: -> { request.options? }
  before_action :disable_http_cache, unless: -> { request.options? }
  before_action :set_employee, only: %i[show update destroy]

  def index
    return head :not_found if request.format.html?

    @employees = Employee.order(:created_at)
    render json: @employees
  end

  def show
    return head :not_found if request.format.html?

    render json: @employee
  end

  def create
    return head :not_found if request.format.html?

    @employee = Employee.new(employee_params)

    if @employee.save
      render json: @employee, status: :created
    else
      render json: { errors: @employee.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    return head :not_found if request.format.html?

    if @employee.update(employee_params)
      render json: @employee
    else
      render json: { errors: @employee.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    return head :not_found if request.format.html?

    @employee.destroy!
    head :no_content
  end

  private

  def authenticate_request
    return head :ok if request.options?

    token = request.headers["Authorization"]&.split(" ")&.last

    if token.blank?
      render json: { error: "Unauthorized" }, status: :unauthorized and return
    end

    begin
      decoded = JWT.decode(token, secret_key, true, algorithm: "HS256").first
      @current_user = User.find(decoded["user_id"])
    rescue JWT::DecodeError, ActiveRecord::RecordNotFound
      render json: { error: "Unauthorized" }, status: :unauthorized and return
    end
  end

  def secret_key
    Rails.application.credentials.secret_key_base || Rails.application.secret_key_base
  end

  def disable_http_cache
    response.headers["Cache-Control"] = "no-store"
    response.headers["Pragma"] = "no-cache"
    response.headers["Expires"] = "0"
  end

  def set_employee
    @employee = Employee.find(params[:id])
  end

  def employee_params
    params.require(:employee).permit(:name, :email, :department, :position)
  end
end
