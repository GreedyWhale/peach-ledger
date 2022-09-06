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

    return send_response({}, :'创建失败', 422, tag.errors) if tag.errors.any?
    send_response(tag) if tag.save
  end

  def update
    tag = Tag.find(params[:id])
    tag.update(params.permit(:name, :emoji))

    return send_response({}, :'更新失败', 422, tag.errors) if tag.errors.any?
    send_response(tag)
  end

  def show
    tag = Tag.find_by(id: params[:id].to_i)

    return send_response({}, :'标签不存在', 404) if tag.nil?
    send_response(tag)
  end

  def destroy
    tag = Tag.find_by(id: params[:id].to_i)
    tag.update(deleted: true)

    return send_response({}, :'删除失败', 422, tag.errors) if tag.errors.any?
    send_response(tag)
  end
end
