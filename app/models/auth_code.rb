class AuthCode < ApplicationRecord
  # 验证码类型
  @@scenes = ['signIn']

  # 验证邮箱字段，必传
  validates :email, presence: { message: '邮箱不能为空' }
  # 目前只支持登录类型的验证码
  validates :scene, acceptance: { accept: @@scenes, message: "验证码类型错误，可接受的类型为：#{@@scenes.join(',')}" }

  # 创建记录之前调用 generate_code 方法
  before_create :generate_code
  # 创建记录之后调用 send_email 方法
  after_create :send_email

  # 生成随机验证码
  def generate_code
    self.code = SecureRandom.random_number.to_s[2..7]
  end

  # 发送邮件
  def send_email
    SignInMailer.sign_in_auth_code_email(self.email, self.code).deliver_later
  end
end