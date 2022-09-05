class Api::V1::TagsController < ApplicationController
  def index
    tags = Tag.where(user_id: request.env['user'].id, category: params[:category], deleted: false)
    send_response(tags)
  end

  def create
    user_id = request.env['user'].id;
    return send_response({}, :unauthorized, 401) unless user_id

    tag = Tag.new(
      user_id: user_id,
      name: params[:name],
      emoji: params[:emoji],
      category: params[:category],
      deleted: false,
    )

    return send_response(tag, '创建成功', 200) if tag.save
    return send_response({}, '创建失败', 422, tag.errors) if tag.errors.any?
  end

  def update
    tag = Tag.find(id: params[:id])

    p tag
  end
end
