class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception
  skip_before_action :verify_authenticity_token, if: :api_request?
  before_action :set_cors_headers, if: :cors_request?
  before_action :handle_preflight, if: :preflight_request?

  def options
    head :ok
  end

  # Only allow modern browsers supporting webp images, web push, badges, import maps, CSS nesting, and CSS :has.
  allow_browser versions: :modern

  # Changes to the importmap will invalidate the etag for HTML responses
  stale_when_importmap_changes

  private

  def api_request?
    request.format.json? || request.path.start_with?('/api/') || request.path.start_with?('/employees')
  end

  def preflight_request?
    request.options?
  end

  def cors_request?
    request.origin.present? && (request.path.start_with?('/api/') || request.path.start_with?('/employees'))
  end

  def handle_preflight
    head :ok
  end

  def set_cors_headers
    response.headers['Access-Control-Allow-Origin'] = request.headers['Origin'] || '*'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, PATCH, DELETE, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Authorization, Content-Type, Accept'
    response.headers['Access-Control-Allow-Credentials'] = 'true'
  end
end
