class SignInMailer < ApplicationMailer
  def sign_in_auth_code_email(email, code)
    @email = email
    @code = code
    mail(to: @email, subject: '桃子记账验证码')
  end
end
