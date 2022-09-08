class Api::V1::SessionsController < ApplicationController
  def create
    if params[:email] != Rails.application.credentials[:admin_account] && params[:code] != Rails.application.credentials[:admin_key]
      return send_response({}, :'备案原因暂时不允许注册', 401)
    elsif params[:email] == Rails.application.credentials[:admin_account] && params[:code] == Rails.application.credentials[:admin_key]
      p '管理员'
    else 
      auth_code = AuthCode.find_by(email: params[:email], code: params[:code], used: false)
      return send_response({}, :'验证码错误', 401) unless auth_code
      return send_response({}, :'Internal Server Error', 500, auth_code.errors) unless auth_code.update(used: true)
    end

    user = User.find_or_create_by(email: params[:email])
    send_response({ token: user.generate_jwt })
  end
end
