class Api::V1::AuthCodesController < ApplicationController
  def create
    scene = params[:scene] || :signIn
    # 限制次数
    if AuthCode.exists?(email: params[:email], scene: scene, created_at: 1.minute.ago..Time.now)
      message = :'发送太频繁，请稍后重试'
      send_response({}, :message, 429, { code: [message] })
      return
    end

    auth_code = AuthCode.new(email: params[:email], scene: scene)

    if auth_code.save
      send_response({}, :'发送成功', 200)
      return
    end

    if auth_code.errors[:email].any?
      send_response({}, :'发送失败，邮箱不能为空', 422, auth_code.errors)
      return;
    end

    send_response({}, :'发送失败', 400, auth_code.errors)
  end
end
