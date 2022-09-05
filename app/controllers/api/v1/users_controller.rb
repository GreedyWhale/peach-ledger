class Api::V1::UsersController < ApplicationController
  def index
    return send_response(request.env['user'])
  end
end
