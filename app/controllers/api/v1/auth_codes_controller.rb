class Api::V1::AuthCodesController < ApplicationController
  def create
    @auth_code = AuthCode.new(email: params[:email], scene: params[:scene])

    if @auth_code.save
      render json: { data: {}, message: '发送成功' }, status: 200
      return
    end

    if @auth_code.errors[:email].any?
      render json: { errors: @auth_code.errors, message: '发送失败，邮箱不能为空' }, status: 422
      return;
    end

    render json: { errors: @auth_code.errors, message: '发送失败' }, status: 422
  end
end
