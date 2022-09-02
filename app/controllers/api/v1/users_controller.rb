class Api::V1::UsersController < ApplicationController
  def index
    user_id = request.env['user_id'] rescue nil
    return send_response({}, :Unauthorized, 401) unless user_id
    user = User.find_by(id: user_id)
    return send_response({}, :'用户不存在', 404) if user.nil?

    return send_response(user)
  end
end
