class ApplicationController < ActionController::API
  # 响应请求
  # message 必须为中文字符串，不然api文档生成的Body 会变成 [binary data]，不知道为什么
  def send_response(data, message = :'请求成功', status = 200, *errors)
    render json: {
      data: data,
      message: message,
      status: status,
      errors: errors[0],
    },
    status: status
  end
end
