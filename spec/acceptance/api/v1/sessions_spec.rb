require 'acceptance_helper'

resource "Sessions" do
  # 接口描述
  explanation "创建用户登录会话"

  # 请求参数说明
  parameter :email, "邮箱地址", required: true, type: :string
  parameter :code, "验证码", required: true, type: :string

  post "/api/v1/sessions" do
    let(:email) { 'test@qq.com' }
    let(:code) { '123456' }

    example "创建会话" do
      do_request
      expect(status).to eq 200

      json = JSON.parse(response_body)
      expect(json["data"]["token"]).to be_a(String)
    end
  end
end
