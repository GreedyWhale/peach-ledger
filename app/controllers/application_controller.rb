class ApplicationController < ActionController::API
  # 响应请求
  def send_response(data, message = :ok, status = 200)
    render json: { data: data, message: message, status: status }
  end
end
