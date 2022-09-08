class Api::V1::ItemsController < ApplicationController
  def create
    user_id = request.env['user'].id
    item = Item.new(
      user_id: user_id,
      name: params[:name],
      tag_id: params[:tag_id],
      category: params[:category],
      amount: params[:amount],
      date: Time.at(params[:date].to_i),
      note: params[:note]
    )

    return send_response({}, :'创建失败', 422, item.errors) unless item.save
    send_response(item)
  end

  def index
    user_id = request.env['user'].id
    page = params[:page].to_i || 1
    sort = params[:sort]
    items = Item
      .where(user_id: user_id)
      .where(date: Time.at(params[:start_date].to_i)..Time.at(params[:end_date].to_i))

    paginated_items = page === -1 ? items.page(1).per(items.count) : items.page(page)

    total_expenses = []
    total_income = []
    items.each do |item|
      if item[:category] == 'expenses'
        total_expenses << item
      else
        total_income << item
      end
    end

    send_response({
        items: sort ? paginated_items.order("date #{sort}") : paginated_items,
        balance: {
          total_expenses: total_expenses.sum(&:amount),
          total_income: total_income.sum(&:amount)
        },
        pagination: {
          total_pages: paginated_items.total_pages,
          current_page: paginated_items.current_page,
          prev_page: paginated_items.prev_page,
          next_page: paginated_items.next_page,
          first_page: paginated_items.first_page?,
          last_page: paginated_items.last_page?
        }
      },
      :'请求成功', 200, nil, :tags
    )
  end

  def destroy
    item = Item.find(params[:id].to_i)
    return send_response({}, :'记录不存在', 404) if item.nil?
    return send_response({}, :'该记录不属于当前用户', 401) if item[:user_id] != request.env['user'].id

    item.delete
    send_response({})
  end
end
