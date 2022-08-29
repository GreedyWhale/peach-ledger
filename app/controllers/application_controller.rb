class ApplicationController < ActionController::API
  # 响应请求
  def send_response(data, message = :ok, status = 200, *errors)
    render json: {
      data: data,
      message: message,
      status: status,
      errors: errors[0],
    },
    status: status
  end
end
