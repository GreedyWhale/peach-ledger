require 'acceptance_helper'

resource "Auth Codes" do
  # 接口描述
  explanation "发送邮件验证码"

  # 请求参数说明
  parameter :email, "邮箱地址", required: true, type: :string
  parameter :scene, "验证码类型：signIn", type: :string, enum: ['signIn']

  post "/api/v1/auth_codes" do
    let(:email) { Rails.application.credentials[:admin_account] }
    let(:scene) { 'signIn' }
    # :document => false 表示这个用例只测试不生成文档
    example "请求参数必须携带 email", :document => false do
      do_request(:email => '')

      expect(status).to eq 422
    end

    example "目前只支持发送用于登录的验证码", :document => false do
      do_request(:email => :email, :scene => :signUp)

      expect(status).to eq 400
      expect(JSON.parse(response_body)['errors']['scene']).not_to be_empty
    end

    example "可以正常发送邮件", :document => false do
      _email = '383911973@qq.com'
      _auth_code = '123456'
      SignInMailer.sign_in_auth_code_email(_email, _auth_code).deliver_now
      ActionMailer::Base.deliveries.last.tap do |mail|
        if !mail
          skip "正常发送的邮件不会放进 ActionMailer::Base.deliveries，所以跳过这个测试"
        end

        expect(mail.from.join('')).to eq(Rails.application.credentials[:email_account])
        expect(mail.to.join('')).to eq(_email)
        expect(mail.subject).to eq('桃子记账验证码')
        expect(mail.body.to_s.match(/<code>(\w{6})<\/code>/iom)[1]).to eq(_auth_code)
      end
    end

    example "发送验证码" do
      do_request

      expect(status).to eq 200
    end
  end
end
