require 'acceptance_helper'

resource "Items" do
  # 接口描述
  explanation "账目的增、删、改、查"

  # 添加token到请求头
  authentication :basic, :auth
  let(:user) { User.create_or_find_by(email: '383911973@qq.com') }
  let(:auth) { "Bearer #{user.generate_jwt}" }
  let(:tag) {
    Tag.create_or_find_by(
      name: '接口测试',
      emoji: ['1F359'],
      category: 'expenses',
      user_id: user.id,
      deleted: false,
    )
  }

  get '/api/v1/items' do
    # 返回字段描述
    with_options :scope => :items do
      response_field :id, 'id'
      response_field :name, '账目名称'
      response_field :note, '账目备注'
      response_field :category, '类型，可能的值有："expenses"、"income"'
      response_field :amount, "金额（分）"
      response_field :user_id, "创建用户id"
      response_field :tag_id, "标签id"
      response_field :date, "账目日期"
      response_field :updated_at, "更新时间"
      response_field :created_at, "创建时间"
    end

    with_options :scope => :pagination do
      response_field :total_pages, '总页数'
      response_field :current_page, '当前页数'
      response_field :prev_page, '上一页的页数'
      response_field :next_page, '下一页的页数'
      response_field :first_page, '是否第一页'
      response_field :last_page, '是否最后一页'
    end
    parameter :start_date, "起始日期，秒数", required: true, type: :string
    parameter :end_date, "结束日期，秒数", required: true, type: :string
    parameter :page, "页数", required: true, type: :number
    parameter :sort, "日期排序, ASC: 小 -> 大， DESC: 大 -> 小", type: :string

    let(:start_date) { (Time.now - 1.day).to_i }
    let(:end_date) { (Time.now + 1.day).to_i }
    let(:page) { 1 }

    example "获取账目信息" do
      5.times do
        Item.create(
          user_id: user.id,
          name: '测试',
          tag_id: tag.id,
          category: 'expenses',
          amount: 1000,
          date: Time.now,
          note: '这是一个测试账目'
        )
      end

      do_request
      expect(JSON.parse(response_body)['data']['items'].size).to eq(5)
    end
  end

  post '/api/v1/items' do
    parameter :name, "账目名称", required: true, type: :string
    parameter :tag_id, "账目标签id", required: true, type: :string
    parameter :category, "分类，可能的值有：expenses、income", required: true, type: :string
    parameter :amount, "金额", required: true, type: :string
    parameter :date, "日期（秒数）", required: true, type: :number
    parameter :note, "备注", type: :string

    with_options :scope => :data do
      response_field :id, 'id'
      response_field :name, '账目名称'
      response_field :note, '账目备注'
      response_field :category, '账目类型，可能的值有："expenses"、"income"'
      response_field :amount, '账目金额'
      response_field :user_id, '账目创建用户id'
      response_field :tag_id, '账目标签id'
      response_field :created_at, '创建日期'
      response_field :updated_at, '更新日期'
      response_field :date, '账目日期'
    end

    let(:name) { '测试' }
    let(:tag_id) { tag.id }
    let(:category) { 'expenses' }
    let(:amount) { 5000 }
    let(:date) { Time.now.to_i }
    let(:note) { '这是一个测试账目' }

    example "创建一条账目" do
      do_request
      expect(status).to eq(200)
      expect(JSON.parse(response_body)['data']['name']).to eq(name)
    end
  end

  delete '/api/v1/items/:id' do
    let (:item) {
      Item.create(
        user_id: user.id,
        name: '测试',
        tag_id: tag.id,
        category: 'expenses',
        amount: 1000,
        date: Time.now,
        note: '这是一个测试账目'
      )
    }
    let (:id) { item.id }

    example "删除账目信息" do
      do_request
      expect(status).to eq(200)
    end
  end
end
