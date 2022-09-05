require 'jwt'
require_relative '../format_response'

class GetUser
  def initialize(app)
    @app = app
  end

  def call(env)
    user_id = env['user_id'] rescue ''
    status = nil
    response = nil

    if user_id
      user = User.find_by(id: user_id);
      if user.nil?
        status = 401
        response = [JSON.generate(FormatResponse.new().generate({}, :'用户不存在', 401))]
      else
        env['user'] = user rescue nil
      end
    end

    return [status, { 'Content-Type' => 'application/json; charset=utf-8' }, response] unless status.nil?

    @app.call(env)
  end
end