require 'jwt'
require_relative '../format_response'

class ValidateJwt
  def initialize(app)
    @app = app
  end

  def call(env)
    white_list = [
      '/api/v1/emojis',
      '/api/v1/auth_codes',
      '/api/v1/sessions'
    ]
    return @app.call(env) if white_list.include?(env['PATH_INFO'])

    token = env['HTTP_AUTHORIZATION'].split(' ')[1] rescue ''
    status = nil
    response = nil
    begin
      payload = JWT.decode(token, Rails.application.credentials[:secret_key_base], true, { algorithm: 'HS256' })
    rescue JWT::ExpiredSignature
      status = 401
      response = [JSON.generate(FormatResponse.new().generate({}, :'token expired', 401))]
    rescue
      status = 401
      response = [JSON.generate(FormatResponse.new().generate({}, :'token invalid', 401))]
    end

    return [status, { 'Content-Type' => 'application/json; charset=utf-8' }, response] unless status.nil?

    env['user_id'] = payload[0]['user_id'] rescue nil
    @app.call(env)
  end
end