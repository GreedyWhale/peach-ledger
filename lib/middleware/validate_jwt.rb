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
    begin
      payload = JWT.decode(token, Rails.application.credentials[:secret_key_base], true, { algorithm: 'HS256' })
    rescue JWT::ExpiredSignature
      return [401, {}, [JSON.generate(FormatResponse.new().generate({}, :'token expired', 401))]]
    rescue
      return [401, {}, [JSON.generate(FormatResponse.new().generate({}, :'token invalid', 401))]]
    end

    env['user_id'] = payload[0]['user_id'] rescue nil
    @status, @headers, @response = @app.call(env)
    [@status, @headers, @response]
  end
end